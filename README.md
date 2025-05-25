See Contributor Rewards →](./REWARDS.md)

Privacy Lion Relay Operator
An open-source NOSTR relay and operator dashboard for privacy-preserving, Bitcoin-paid data vending.

Turn any desktop into a NOSTR relay with 1-click.

Own and monetize your data—get paid in BTC.

Full privacy, permissioned payments, and no corporate middlemen.

Includes DVM support, Lightning integration, and relay moderation.

Features
Simple GUI: 1-click start/stop relay with visual status.

Pay-to-Write: Only paid users can post data/events.

DVM Integration: Share, manage, and monetize user data securely.

BTC/Lightning Payments: Withdraw rewards or receive payouts in Bitcoin.

Branch Protection: Secure open-source code—PRs must be reviewed.

Contributor Rewards: See REWARDS.md.

Quick Start
Clone this repo:

git clone https://github.com/PrivacyLion/relay-operator-app.git
cd relay-operator-app

Install dependencies:

Rust & Tauri GUI:
cd relay-operator-gui/src-tauri
cargo build --release

Python relay (if using):
pip install -r requirements.txt

Launch the app:

Run the Tauri GUI:
cargo tauri dev
(Or launch the built binary in target/release/)

Or run the Python relay:
python relay_app.py

How to Contribute
Open a pull request against master (default branch).

Read REWARDS.md for how BTC rewards work.

Please follow our branch protection and code review policies.

License
This project is licensed under the Elastic License 2.0.

About Privacy Lion
Privacy Lion empowers anyone to operate paid NOSTR relays and sell their own data—no gatekeepers, no Big Tech, just Bitcoin.







