
import { useEffect, useRef, useState } from 'react'
import { supabase } from '../supabase'

type UserProfile = {
  id: number
  name: string | null
  username: string | null
  email: string | null
  role: string | null
  profile_image: string | null
  cover_image: string | null
}

type ArtistProfile = {
  stage_name: string | null
  bio: string | null
  profile_image: string | null
  verification_status: string | null
}

function Profile({ onBack }: { onBack: () => void }) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [artist, setArtist] = useState<ArtistProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')

  const photoInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!success) return

    const timer = window.setTimeout(() => {
      setSuccess('')
    }, 5 * 1000)

    return () => window.clearTimeout(timer)
  }, [success])

  useEffect(() => {
    async function loadProfile() {
      setLoading(true)
      setError('')

      const { data: authData, error: authError } =
        await supabase.auth.getUser()

      if (authError || !authData.user) {
        setError('We could not identify your account. Please sign in again.')
        setLoading(false)
        return
      }

      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, name, username, email, role, profile_image, cover_image')
        .eq('auth_user_id', authData.user.id)
        .maybeSingle()

      if (userError) {
        setError(userError.message)
        setLoading(false)
        return
      }

      if (!userData) {
        setError('Your profile could not be found.')
        setLoading(false)
        return
      }

      const userProfile = userData as UserProfile

      setProfile(userProfile)
      setName(userProfile.name || '')
      setUsername(userProfile.username || '')

      if (userProfile.role?.toLowerCase() === 'artist') {
        const { data: artistData, error: artistError } = await supabase
          .from('artists')
          .select('stage_name, bio, profile_image, verification_status')
          .eq('user_id', userProfile.id)
          .maybeSingle()

        if (artistError) {
          setError(artistError.message)
          setLoading(false)
          return
        }

        setArtist(artistData as ArtistProfile | null)
      }

      setLoading(false)
    }

    loadProfile()
  }, [])

  async function uploadImage(
    event: React.ChangeEvent<HTMLInputElement>,
    imageType: 'profile' | 'cover'
  ) {
    const file = event.target.files?.[0]

    if (!file || !profile) return

    setError('')
    setSuccess('')

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

    if (!allowedTypes.includes(file.type)) {
      setError('Please choose a JPG, PNG or WebP image.')
      event.target.value = ''
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setError('Your image must be smaller than 2MB.')
      event.target.value = ''
      return
    }

    if (imageType === 'profile') {
      setUploadingPhoto(true)
    } else {
      setUploadingCover(true)
    }

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser()

      if (authError || !authData.user) {
        throw new Error('Please sign in again before uploading an image.')
      }

      const extension = file.type.split('/')[1].replace('jpeg', 'jpg')
      const filePath = `${authData.user.id}/${imageType}-${Date.now()}.${extension}`

      const { error: uploadError } = await supabase.storage
        .from('profile-images')
        .upload(filePath, file, {
          contentType: file.type,
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      const { data: publicUrlData } = supabase.storage
        .from('profile-images')
        .getPublicUrl(filePath)

      const imageUrl = publicUrlData.publicUrl

      const column = imageType === 'profile'
        ? 'profile_image'
        : 'cover_image'

      const { error: updateError } = await supabase
        .from('users')
        .update({ [column]: imageUrl })
        .eq('auth_user_id', authData.user.id)

      if (updateError) throw updateError

      setProfile((current) =>
        current ? { ...current, [column]: imageUrl } : current
      )

      if (imageType === 'profile' && profile.role?.toLowerCase() === 'artist') {
        const { error: artistUpdateError } = await supabase
          .from('artists')
          .update({ profile_image: imageUrl })
          .eq('user_id', profile.id)

        if (artistUpdateError) throw artistUpdateError

        setArtist((current) =>
          current ? { ...current, profile_image: imageUrl } : current
        )
      }

      setSuccess(
        imageType === 'profile'
          ? 'Your profile picture has been updated successfully.'
          : 'Your cover picture has been updated successfully.'
      )
    } catch (uploadError) {
      const message =
        uploadError instanceof Error
          ? uploadError.message
          : 'Something went wrong while uploading your image.'

      setError(message)
    } finally {
      setUploadingPhoto(false)
      setUploadingCover(false)
      event.target.value = ''
    }
  }

  async function handleSave() {
    if (!profile) return

    if (!name.trim() || !username.trim()) {
      setError('Name and username cannot be empty.')
      return
    }

    setSaving(true)
    setError('')
    setSuccess('')

    const cleanUsername = username.trim().replace(/^@/, '')
    const { data: authData } = await supabase.auth.getUser()

    const { data, error: updateError } = await supabase
      .from('users')
      .update({
        name: name.trim(),
        username: cleanUsername,
      })
      .eq('auth_user_id', authData.user?.id)
      .select('id, name, username, email, role, profile_image, cover_image')
      .single()

    if (updateError) {
      setError(updateError.message)
      setSaving(false)
      return
    }

    setProfile(data as UserProfile)
    setName(data.name || '')
    setUsername(data.username || '')
    setEditing(false)
    setSuccess('Your profile has been updated successfully.')
    setSaving(false)
  }

  function cancelEditing() {
    setName(profile?.name || '')
    setUsername(profile?.username || '')
    setEditing(false)
    setError('')
    setSuccess('')
  }

  const isArtist = profile?.role?.toLowerCase() === 'artist'

  const displayName = isArtist
    ? artist?.stage_name || profile?.name
    : profile?.name

  const image = isArtist
    ? artist?.profile_image || profile?.profile_image
    : profile?.profile_image

  return (
    <section className="mx-auto max-w-4xl">
      <button
        onClick={onBack}
        className="mb-8 rounded-xl border border-white/10 px-4 py-2 text-sm text-white/70 transition hover:bg-white/5 hover:text-white"
      >
        ← Back to Home
      </button>

      <div className="mb-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-emerald-400">
          YOUR 4EVA ACCOUNT
        </p>

        <h1 className="mt-3 text-3xl font-black sm:text-5xl">
          My Profile
        </h1>

        <p className="mt-3 text-sm text-white/50 sm:text-base">
          Your identity and place in the 4EVA community.
        </p>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-[#10291D] p-8 text-center text-white/60">
          Loading your profile...
        </div>
      ) : error && !profile ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-sm text-red-300"
        >
          {error}
        </div>
      ) : profile ? (
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#10291D]">

          {/* Cover picture */}
          <div
            onClick={() => coverInputRef.current?.click()}
            className="group relative h-36 cursor-pointer overflow-hidden bg-gradient-to-r from-emerald-900 via-emerald-800 to-[#0D3020] sm:h-48"
          >
            {profile.cover_image && (
              <img
                src={profile.cover_image}
                alt="Cover"
                className="h-full w-full object-cover"
              />
            )}

            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition group-hover:bg-black/30">
              <span className="rounded-full bg-black/50 px-4 py-2 text-xs font-semibold text-white opacity-0 transition group-hover:opacity-100">
                {uploadingCover ? 'Uploading...' : 'Change cover picture'}
              </span>
            </div>

            <input
              ref={coverInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => uploadImage(event, 'cover')}
              className="hidden"
            />
          </div>

          {/* Profile picture and details */}
          <div className="px-5 pb-8 sm:px-8">
            <div className="relative z-10 -mt-14 flex items-end gap-4 sm:-mt-16">

              {/* Profile picture */}
              <div className="relative h-28 w-28 shrink-0 sm:h-32 sm:w-32">
                <div className="h-full w-full overflow-hidden rounded-full border-4 border-[#10B981] bg-[#174C35]">
                  {image ? (
                    <img
                      src={image}
                      alt="Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl font-black text-emerald-300">
                      {(displayName || profile.username || '4')
                        .charAt(0)
                        .toUpperCase()}
                    </div>
                  )}
                </div>

                {/* Plus icon attached to profile picture */}
                <button
                  type="button"
                  onClick={() => photoInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  aria-label="Add or change profile picture"
                  title="Add profile picture"
                  className="absolute -right-1 bottom-3 z-20 flex h-7 w-7 translate-y-0 items-center justify-center rounded-full border-2 border-[#10B981] bg-[#10291D] text-xl font-light leading-none text-[#10B981] transition hover:bg-emerald-400/10 disabled:opacity-50"
                >
                  {uploadingPhoto ? (
                    <span className="text-xs">...</span>
                  ) : (
                    '+'
                  )}
                </button>

                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => uploadImage(event, 'profile')}
                  className="hidden"
                />
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold sm:text-3xl">
                {displayName || '4EVA User'}
              </h2>

              <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold capitalize text-emerald-300">
                {profile.role || 'Fan'}
              </span>

              {isArtist &&
                artist?.verification_status?.toLowerCase() === 'verified' && (
                  <span className="rounded-full bg-blue-400/10 px-3 py-1 text-xs font-semibold text-blue-300">
                    Verified Artist ✓
                  </span>
                )}
            </div>

            <p className="mt-2 text-sm text-white/50">
              @{profile.username || 'username'}
            </p>

            {success && (
              <p role="status" className="mt-5 text-sm text-green-400">
                {success}
              </p>
            )}

            {error && (
              <p role="alert" className="mt-5 text-sm text-red-400">
                {error}
              </p>
            )}

            <div className="mt-7 flex flex-wrap gap-3">
              {!editing ? (
                <button
                  onClick={() => {
                    setEditing(true)
                    setError('')
                    setSuccess('')
                  }}
                  className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-[#071A12] transition hover:bg-emerald-300"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-[#071A12] transition hover:bg-emerald-300 disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>

                  <button
                    onClick={cancelEditing}
                    disabled={saving}
                    className="rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/5"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>

            <div className="mt-8 grid gap-5 border-t border-white/10 pt-7 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  Full name
                </p>

                {editing ? (
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#071A12] px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="mt-2 break-words text-sm text-white/90">
                    {profile.name || 'Not provided'}
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  Username
                </p>

                {editing ? (
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#071A12] px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"
                    placeholder="Enter your username"
                  />
                ) : (
                  <p className="mt-2 break-words text-sm text-white/90">
                    @{profile.username || 'Not provided'}
                  </p>
                )}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                  Email address
                </p>

                <p className="mt-2 break-words text-sm text-white/90">
                  {profile.email || 'Not provided'}
                </p>
              </div>

              {isArtist && (
                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/40">
                    Artist bio
                  </p>

                  <p className="mt-2 text-sm leading-7 text-white/70">
                    {artist?.bio || 'No artist bio has been added yet.'}
                  </p>
                </div>
              )}

              {isArtist && !artist && (
                <p className="text-sm leading-6 text-amber-300 sm:col-span-2">
                  Your artist profile has not been set up yet.
                </p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}

export default Profile
