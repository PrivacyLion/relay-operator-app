[See Contributor Rewards →](./REWARDS.md)

# Privacy Lion Relay Operator

An open-source NOSTR relay and operator dashboard for privacy-preserving BTC paid data vending.

- Turn any computer into a NOSTR relay with 1-click.
- Own and monetize your data—get paid in BTC.
- Full privacy, permissioned payments, and no corporate middlemen.
- Includes DVM support, Lightning integration, and relay moderation.

---

## Features

- **Simple GUI:** 1-click start/stop relay with visual status.
- **Pay-to-Write:** Only paid users can post data/events.
- **DVM Integration:** Share, manage, and monetize user data securely.
- **BTC/Lightning Payments:** Withdraw rewards or receive payouts in Bitcoin.
- **Branch Protection:** Secure open-source code—PRs must be reviewed.
- **Contributor Rewards:** See [REWARDS.md](./REWARDS.md).

---

## How Data Buyers use this App

**Companies connect to the relay to discover and purchase user data securely. Data is published as encrypted NOSTR events controlled by users. Buyers pay in BTC to unlock access, enforced by the relay’s pay-to-read system. Payments are made to data owners, relay operators and creator for the first and only privacy-first data marketplace.**

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

**Privacy Lion empowers individuals to reclaim control over their data and privacy by running NOSTR relays. Our mission is to eliminate data gatekeepers by enabling direct privacy-first data vending powered by Bitcoin.**

**For Individuals:** Your data is your data. It’s being collected and sold anyways — so why not take back control and earn Bitcoin from it? Privacy Lion enables you to monetize your data securely and transparently. You will be in control and you will be compensated for it. We put power back where it belongs: with you.

**For Data Buyers:** Privacy Lion offers an easy, secure and privacy-first data vending marketplace. This gives access to high-quality permissioned data directly from users. No middlemen, no metadata, no Big Tech contracts, and no inefficient ad-based campaigns. Now you can buy user data directly from clients, customers or prospects. Welcome to sovereign data vending.












