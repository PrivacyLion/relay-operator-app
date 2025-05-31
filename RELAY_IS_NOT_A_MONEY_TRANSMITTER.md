# RELAY_IS_NOT_A_MONEY_TRANSMITTER.md

---

## Purpose

This document outlines why the Privacy Lion relay architecture is **not a money transmitter** under U.S. FinCEN guidance. It is intended for legal counsel, contributors and community members seeking clarification on regulatory risk.

---

## Summary

The Privacy Lion relay enforces pay-to-read access on encrypted NOSTR data events (`kind: 30078`) using **peer-to-peer Lightning Network payments**. It **never accepts, holds, or transmits funds**, and does **not act as a financial intermediary**.

Payments are made directly from the **buyer’s wallet** to:

- The **data seller** (user)  
- The **relay operator** (data host)  
- The **creator** (maintainer)

The relay acts as a **data host**, listening for payment completion and conditionally unlocking content. This architecture avoids classification as a money transmitter.

---

## Definitions

**User (Seller):**  
An individual who creates their own data using the Privacy Lion mobile app and publishes it as an encrypted NOSTR event (e.g., kind: 30078). The user selects a payout method — either a custodial Lightning wallet (e.g. Cash App, Strike) or a non-custodial Lightning wallet (e.g. Breez SDK or NWC). Users who choose a non-custodial option are fully responsible for managing their private keys. In practice, many users may prefer custodial wallets for ease of use. Users are not custodially onboarded by Privacy Lion or the relay operator.

**Relay Operator (Data Host):**  
An individual or entity who runs the Privacy Lion relay software to host NOSTR events and enforce access rules. The operator sets their own payout wallet and receives a fixed fee directly from the buyer. Relay operators do not custody funds and do not initiate or control any payment routing.

**Creator (Maintainer):**  
The organization or entity (e.g., Privacy Lion LLC) that developed and maintains the relay software and broader architecture. The creator receives a fixed fee directly from the buyer. The creator never takes custody of any funds and does not participate in payment flow or control user wallets.

**Buyer:**  
An individual or organization who browses metadata published to the relay and elects to unlock access to encrypted data by paying Lightning invoices. The buyer initiates all Lightning payments directly from their own wallet to each party (user, relay operator, and creator). Buyers never send funds to the relay itself and retain full control over their payment tools and methods.

---

## Legal Definitions (FinCEN)

The U.S. Department of the Treasury's Financial Crimes Enforcement Network (FinCEN) regulates Money Services Businesses (MSBs), including entities classified as **money transmitters**.

### Legal Source

The key definition appears in the **Code of Federal Regulations (31 CFR § 1010.100(ff)(5))**, which defines a money transmitter as:

> *“A person that provides money transmission services, or any other person engaged in the transfer of funds. The term 'money transmission services' means the acceptance of currency, funds, or other value that substitutes for currency from one person and the transmission of currency, funds, or other value that substitutes for currency to another location or person by any means.”*

This includes—but is not limited to—transfers via wire, check, electronic means, or value exchange networks like Bitcoin or Lightning.

### What Triggers MSB Classification

To be classified as a money transmitter under FinCEN’s regulations, an entity must:

1. **Accept funds** or value from one person, and  
2. **Transmit those funds** to another person or location.

**Both conditions must be met.** If either is not true, the business is not considered a money transmitter.

### Why the Privacy Lion Relay Is Not a Money Transmitter

The Privacy Lion relay does **not** satisfy either condition:

- It **does not accept** funds from any party (buyers send funds directly via Lightning).
- It **does not transmit** funds to any other party.
- It has **no access to user funds**, does **not perform settlements**, and **does not act as a financial intermediary**.

Instead, it operates as a **data host**, enforcing access to encrypted user-controlled data via externally verifiable peer-to-peer Lightning payments.

---

## Relay Architecture

### What the Relay *Does*

- Hosts encrypted user-published events (NOSTR `kind: 30078`)  
- Provides metadata about data for sale (e.g., amount, wallet type, destination)  
- Generates **3 separate payment invoices** for:
  - The data seller  
  - The relay operator  
  - The creator (mandatory)  
- Listens for external Lightning payments  
- Unlocks data access after all payments are confirmed

### What the Relay *Does NOT Do*

- Does **not** accept or transmit funds  
- Does **not** generate a bundled invoice  
- Does **not** split or forward payments  
- Does **not** custody Lightning or on-chain BTC  
- Does **not** serve as an exchange or fiat on/off-ramp

---

## Why This Is Not Money Transmission

### No Custody  
All payments go directly wallet-to-wallet. The relay never touches funds.

### No Transmission  
The relay does not receive funds from buyers or transmit to sellers. All transactions are initiated and completed by users.

### No Mixing or Obfuscation  
There is no logic designed to obscure the source or flow of funds.

### Pure Conditional Access  
Relay only checks for externally verifiable payment and unlocks content. It acts as a **digital data host**, not a financial intermediary.

---

## Three-Wallet Schema Overview

The Privacy Lion system uses a **user-selected, three-wallet schema** to maintain full decentralization and eliminate custody risk. Each participant designates their own payout method, and all Lightning payments are peer-to-peer.

### Roles & Wallets

| Role              | Who Sets It | Destination Example                   | Used For                    |
|-------------------|-------------|----------------------------------------|-----------------------------|
| **User (Seller)** | Mobile App  | NWC, Breez SDK, or LNURL-pay          | Earns 90% of sale           |
| **Relay Operator**| Config File | Static node pubkey or LNURL           | Receives 8.5% fee           |
| **Creator**       | App Config  | Static Lightning address               | Earns 1.5% of sale          |

Each party is paid directly. The relay only reads wallet metadata from the event and listens for payment confirmation.

> **At no point does the relay hold, forward, or split payments.**

---

## Auditability

All transactions occur on the public Lightning Network and can be independently verified by users and third parties.  
The relay does not maintain internal ledgers, databases, or balances for any users.

---

## ***U.S. Jurisdictional Considerations***

To reduce legal exposure:

- The Privacy Lion relay does **not** possess a New York BitLicense.
- Therefore, **Privacy Lion blocks access from New York IP addresses** to the relay, mobile app, and browser extension.
- The system is non-custodial and never pools, splits, or forwards funds.
- All contributors and operators are advised to consult legal counsel if operating in sensitive U.S. jurisdictions.

---

### ***California (CA)***

- California’s prior **Digital Financial Assets Law (AB 2269)** attempted to introduce a licensing regime for virtual asset businesses. Although vetoed in 2022, similar bills may reappear.
- Privacy Lion currently **does not meet the definition of a "digital financial asset business"** because it holds no custody, does not intermediate transactions, and operates only as a data host.
- Privacy Lion does **not solicit, onboard, or contract with California residents** for financial services, and recommends that all operators monitor California’s legislative developments.

---

### ***Florida (FL)***

- Florida law defines money services businesses under **Chapter 560** of the Florida Statutes. However, its regulatory reach primarily targets custodial financial platforms.
- The Florida Office of Financial Regulation (OFR) has not interpreted **non-custodial, peer-to-peer Lightning relay platforms** as MSBs, but guidance is evolving.
- Privacy Lion maintains **no custodial accounts, no transmission function, and no financial contracts** with Florida users.

---

### ***State-by-State Risk Summary*** (Alphabetical)

| State         | Risk Trigger                                | Why We're Compliant                                                 |
|---------------|---------------------------------------------|----------------------------------------------------------------------|
| Alaska        | No crypto-specific MSB exemptions           | Relay is stateless and does not touch user funds                    |
| California    | Pending or vetoed crypto regulation         | No custody, no fiat ramps, no user identity storage. Stateless P2P model. |
| Colorado      | State-chartered crypto custody framework    | Relay is not a custodian and holds no user funds                    |
| Connecticut   | Custody = license                           | Relay is stateless, non-custodial, and transmits no value          |
| Florida       | Chapter 560 MSB law                         | We never transmit or custody funds. Payments are peer-to-peer only |
| Georgia       | Virtual currency under general MSB laws     | Relay does not convert, transmit, or hold value; P2P only           |
| Hawaii        | License requirement repealed (July 2024)    | Hawaii no longer requires licenses for crypto. We remain non-custodial |
| Illinois      | Digital Asset Regulation Act (DARA)         | Law targets custodians; relay has no custody or fiat involvement    |
| Massachusetts | Aggressive AG enforcement on crypto ads     | We do not onboard users with fiat or target retail consumers        |
| Minnesota     | Broad MSB definitions may include relays    | Our relay is non-custodial, stateless, and doesn’t facilitate exchange |
| New Jersey    | Proposed BitLicense-style law               | Relay operates without custody or value transmission                |
| New York      | BitLicense required for virtual currency    | We proactively block all NY IPs. No users in jurisdiction = no exposure |
| North Carolina| Money transmission includes virtual currency| We never hold or transmit funds. Lightning is peer-to-peer and user-initiated |
| Oregon        | Exploring stablecoin and crypto taxation    | Relay has no stablecoin or fiat exposure; monitor for future laws   |
| Pennsylvania  | Studying virtual currency MSB status        | Relay performs no money transmission and holds no assets            |
| Texas         | Custodial wallet triggers MSB rules         | Relay does not custody or transmit funds; users hold their own keys |
| Washington    | Licensure required for crypto transmitters  | No fiat ramps or custody; Lightning payments handled by users       |

---

## ***International Considerations***

### ***International Summary*** (Alphabetical)

| Region/Country     | Regulatory Status                                                                 | Why We're Compliant                                                                                         |
|--------------------|------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------------------|
| Australia          | AUSTRAC regulates custody and exchanges                                            | Relay avoids custody and fiat entirely; user payments are peer-to-peer over Lightning                       |
| Bahrain            | Regulated market for exchanges and custodians                                     | Relay is not an exchange or custodian — not subject to licensing                                            |
| Brazil             | Legal framework passed; crypto exchanges must register with central bank           | Relay is not an exchange or custodian. Peer-to-peer architecture keeps it outside licensing scope           |
| European Union (EU)| MiCA regulates exchanges/custody. GDPR applies                                     | Relay is non-custodial and stateless. Recommend ephemeral storage to comply with GDPR                       |
| Hong Kong          | Licensing required for retail exchanges                                            | Relay does not target retail users or offer custody services                                                |
| India              | 30% tax on crypto income; exchanges must register and comply with AML/KYC          | Relay does not custody, convert, or process crypto; Lightning is user-controlled and stateless              |
| Israel             | Regulated market for exchanges and custodians                                      | Relay does not hold funds or operate as a VASP — not subject to licensing                                   |
| Japan              | Strict exchange licensing; AML required                                            | Relay does not trade, custody, or process fiat — not subject to FSA oversight                               |
| Jordan             | Banks prohibited from crypto; private use not illegal                              | Relay does not use banks or touch fiat; Lightning remains user-controlled                                   |
| Kuwait             | Unclear framework; monitoring underway                                             | Relay avoids custody and fiat; operates legally within current uncertainty                                  |
| Lebanon            | Crypto tolerated but unregulated                                                   | No custody, no fiat — relay remains outside state-controlled financial system                               |
| Oman               | No formal licensing; crypto discouraged                                            | Stateless architecture with no fiat involvement minimizes regulatory exposure                               |
| Philippines        | BSP licenses exchanges and custodians                                              | Relay does not provide fiat ramps or hold user funds — not a VASP                                           |
| Qatar              | VASP licensing under development                                                   | Relay does not custody, exchange, or issue assets — not within regulatory scope                             |
| Saudi Arabia       | Crypto not banned, but banks prohibited from processing                           | Relay avoids fiat and banking rails; Lightning is user-controlled and P2P                                  |
| Singapore          | Licensing required for DPT providers                                               | Relay is not a DPT service provider — no custody, no exchange, no token issuance                            |
| South Africa       | Crypto classified as financial product; exchanges require FSCA license             | Relay is not an exchange or financial product provider — no custody, fiat, or asset issuance involved       |
| South Korea        | Strict licensing under FSC and Financial Intelligence Unit (FIU)                   | Relay does not offer custody or fiat ramps. P2P Lightning usage and stateless relay place it outside VASP scope |
| Switzerland        | Crypto-friendly but regulated for custodians                                       | Relay is stateless and holds no funds — not in scope                                                        |
| Taiwan             | Soft-regulated. Exchanges follow AML guidance                                      | Relay does not handle fiat or user identity — exempt from current AML scope                                 |
| Thailand           | Crypto regulated by Thai SEC                                                       | Relay is infrastructure only; does not operate as an exchange or wallet                                     |
| Turkey             | Crypto payments banned for goods/services                                          | Relay does not support goods/service payments — only metadata access via pay-to-read                        |
| United Arab Emirates (UAE) | Licensing required for VASPs under VARA/SCA/ADGM                           | Relay is non-custodial, stateless, and does not qualify as a VASP                                           |
| United Kingdom (UK)| FCA regulates exchanges, wallets, promotions                                       | Relay is infrastructure only — not a regulated financial service                                            |
| Vietnam            | Crypto unregulated; not legal tender                                               | Relay is stateless, avoids fiat, and does not operate as an exchange                                        |

---

### ***Blocked Jurisdictions*** (Alphabetical)

| Country        | Reason for Block                                                                 |
|----------------|----------------------------------------------------------------------------------|
| **Cuba**       | U.S. embargo prohibits offering software or services to Cuban residents           |
| **Egypt**      | Crypto banned by Central Bank; providing access would violate national law        |
| **Iran**       | Comprehensive U.S. sanctions. Any access = OFAC exposure                          |
| **Russia**     | Under U.S., EU, and UK sanctions. Providing service = high OFAC/FATF enforcement risk |
| **Syria**      | Broad U.S. and EU sanctions; export of tech/services to Syria is prohibited       |
| **Venezuela**  | Subject to U.S. sanctions, especially around crypto (e.g., Petro); access creates compliance risk |

---

## Important Notes

To maintain legal protection:
- Never custody funds  
- Never bundle payments  
- Keep payment logic peer-to-peer and stateless  
- Avoid user onboarding, wallet control, or transmission of value  
- Block IP access from New York to reduce jurisdictional risk

---

## Conclusion

The Privacy Lion relay is a decentralized, non-custodial **data host**. It enforces access based on peer-to-peer Lightning payments, **never accepts funds**, and never acts as an intermediary.

> **Therefore, it is not a money transmitter.**

---

**Legal Contact:** legal@privacy-lion.com  
**Maintainer:** Privacy Lion LLC  
**Last Reviewed:** May 31, 2025


