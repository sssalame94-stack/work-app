# Work

ERP app for Performance Inc. (and more sub-apps), for **Android** and **Windows**.

- Data: Supabase (project `work-app`), synced live between devices
- Backups: Google Drive, folder `Work App Backup / <Sub-app> Backup`
- Builds: GitHub Actions (`.github/workflows/release.yml`)

## Publishing a new version

1. Upload the updated files to this repository.
2. Go to **Releases > Draft a new release**.
3. **Choose a tag**: type the new version, for example `v1.0.1` (always higher than the last one), then **Create new tag**.
4. Click **Publish release**.
5. Wait about 15 minutes (see the **Actions** tab). The release then contains:
   - `WorkApp-x.x.x.apk` for Android
   - `WorkApp-Setup-x.x.x.exe` for Windows

The Windows app updates itself. The Android app shows "Update available".
Your data is never touched by an update: it lives in Supabase.

## Never lose

The Android signing key (GitHub secrets `ANDROID_KEYSTORE_*`, `ANDROID_KEY_*`).
Without the same key, Android refuses to install updates over the existing app.
