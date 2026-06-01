# Deploy the backend to Hugging Face Spaces (free, 16 GB RAM)

This folder (`deploy/hf-space/`) is a **complete, ready-to-push Space**. It
already contains the required `README.md` with YAML config (which fixes the
"Missing configuration in README" error), a Docker `Dockerfile` on port 7860,
`requirements.txt`, and the full `app/` backend.

Pushing with git uploads everything at once — no file-by-file uploads.

## Steps

1. **Create the Space** at <https://huggingface.co/new-space>
   - Owner: your account · Name: `veracity-api`
   - SDK: **Docker** · Visibility: **Public**
   - Do NOT initialize with a template (we provide our own README).

2. **Push this folder to the Space repo:**

   ```bash
   cd deploy/hf-space

   git init
   git add .
   git commit -m "Veracity API — Dockerized FastAPI backend"
   git branch -M main
   git remote add space https://huggingface.co/spaces/<your-username>/veracity-api
   git push space main
   ```

   If prompted for a password, use a Hugging Face **access token** with write
   scope (https://huggingface.co/settings/tokens), not your account password.

3. **Set Space Variables** (Settings → Variables and secrets → Variables):

   | Variable | Value |
   | --- | --- |
   | `APP_ENVIRONMENT` | `production` |
   | `APP_MODEL_MODE` | `full` |
   | `APP_HF_REPO_ID` | `adityarajmishra/veracity-bert-liar` |
   | `APP_ALLOWED_ORIGINS` | `https://veracity-bert-liar.vercel.app` |

   (These are also baked into the Dockerfile as defaults, so it will work even
   if you skip this — but setting `APP_ALLOWED_ORIGINS` to your real domain is
   recommended for security.)

4. **Wait for the build.** The Space builds the Docker image, then downloads the
   model weights from your Hub repo on first boot (watch the logs). When ready,
   the API is live at:

   ```
   https://<your-username>-veracity-api.hf.space
   ```

5. **Connect the frontend.** In Vercel, set the environment variable
   `VITE_API_URL` to your Space URL and redeploy. The status pill in the header
   will turn green.

## Verify

```bash
curl https://<your-username>-veracity-api.hf.space/health
curl -X POST https://<your-username>-veracity-api.hf.space/predict \
  -H "Content-Type: application/json" \
  -d '{"statement":"The economy grew three percent last year."}'
```
