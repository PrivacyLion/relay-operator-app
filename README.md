[See Contributor Rewards →](./REWARDS.md)

# Privacy Lion Relay Operator

An open-source NOSTR relay and operator dashboard for privacy-preserving BTC paid data vending.

- Turn any computer into a NOSTR relay with 1-click.
- Own and monetize your data and get paid in BTC.
- Full privacy, permissioned payments and no middlemen.
- Includes DVM support, Lightning integration and relay moderation.

---

## Features

- **Simple GUI:** 1-click start/stop relay with visual status.
- **Pay-to-Write:** Only paid users can post data/events.
- **DVM Integration:** Share, manage and monetize user data securely.
- **BTC/Lightning Payments:** Withdraw rewards or receive payouts in Bitcoin.
- **Branch Protection:** Secure open-source code; PRs must be reviewed.
- **Contributor Rewards:** See [REWARDS.md](./REWARDS.md).

---

## How Data Buyers use this App

**Companies connect to the relay to discover and purchase user data. User data is published as encrypted NOSTR events controlled by users. Buyers pay in BTC to unlock access that is enforced by the relay’s pay-to-read system. BTC payments % are made to data owners (90%), relay operators (8.5%) and creator (1.5%) for the first and only privacy-first data marketplace.**

---

## Quick Start

1. Clone this repo:

```bash 
git clone https://github.com/PrivacyLion/relay-operator-app.git
cd relay-operator-app
```

2. Install dependencies:

- Rust & Tauri GUI:

```bash
cd relay-operator-gui/src-tauri
cargo build --release
```

- Python relay (if using):

```bash
pip install -r requirements.txt
```

3. Launch the app:

- Run the Tauri GUI:

```bash
cargo tauri dev
(Or launch the built binary in target/release/)
```

- Or run the Python relay:

```bash
python relay_app.py
```

---

## How to Contribute

- Open a pull request against `master` (default branch).
- Read [REWARDS.md](./REWARDS.md) for how BTC rewards work.
- Please follow our branch protection and code review policies.

---

## License

This project is licensed under the [Elastic License 2.0](./LICENSE).

---

## About Privacy Lion

**Privacy Lion LLC is a mission-driven for-profit company. Our mission is to save privacy from the internet. All code is open source and purpose-built to empower humans to control their identity and data.**












