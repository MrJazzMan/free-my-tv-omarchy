# Free My TV — Omarchy

Omarchy-style skin and themes for [Free My TV](https://github.com/simbasjungles/free-my-tv) on Samsung Tizen (and the same web UI on other targets).

This is a **derivative** of [simbasjungles/free-my-tv](https://github.com/simbasjungles/free-my-tv) (MIT). It focuses on the Omarchy look: Tokyo Night and the other official Omarchy themes, a Waybar-like top bar, workspaces 1–5 with per-workspace wallpapers, a wallpaper gallery, screensaver, seamless dock logos, and example HDMI input tiles (e.g. HDMI 1 / PlayStation on HDMI 3).

> Nota PT: pele estilo Omarchy para o Free My TV na Samsung/Tizen. Créditos e licença MIT abaixo.

## What differs from upstream

- **Omarchy themes** — palettes from [omacom/omarchy](https://github.com/omacom/omarchy) `colors.toml`, plus bundled wallpapers (see `web/wallpapers/SOURCES.txt`)
- **Top bar** — Waybar-like bar with Omarchy glyph and workspace pills
- **Workspaces 1–5** — each can keep its own gallery wallpaper
- **Gallery** — OK sets the wallpaper for the current workspace; ↓ from the drawer
- **Dock** — seamless logos (Apple TV, Disney+, Max, Twitch, PlayStation); optional HDMI input tiles and IPTV name-only example
- **Home** — no Explorar / picks row by design; big clock + dock focus
- **Theme picker** — palette button / home settings

## Credits

- **Upstream:** [simbasjungles/free-my-tv](https://github.com/simbasjungles/free-my-tv) — MIT
- **Omarchy:** [omacom/omarchy](https://github.com/omacom/omarchy) — MIT (DHH); wallpaper artist notes in `web/wallpapers/SOURCES.txt`
- **Simple Icons** — where used for seamless logos
- See also `NOTICE` and `LICENSE`

## Build / install

Follow the upstream docs in this tree (`README` sections below from Free My TV, `docs/`, `tizen/`, `build.sh`).

1. Copy `config.example.properties` → `config.properties` locally (gitignored).
2. Fill in your own TMDB key and optional coords — **never commit** `config.properties`, `*.keystore`, or `*.wgt`.
3. Build and sideload as documented upstream for Tizen / webOS / Android.

This public repo does **not** ship secrets, signing certificates, or a prebuilt `.wgt`. Screenshots can be added later.

## License

MIT — same as upstream Free My TV. This derivative keeps that license; Omarchy assets remain under their upstream terms as noted in `SOURCES.txt` / `NOTICE`.
