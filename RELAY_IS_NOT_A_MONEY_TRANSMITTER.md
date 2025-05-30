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
- The **creator/maintainer** (creator)

The relay acts as a **data host**, listening for payment completion and conditionally unlocking content. This architecture avoids classification as a money transmitter.

---

## Legal Definitions (FinCEN)

> *“A money transmitter is any person... who accepts currency, funds, or other value that substitutes for currency from one person and transmits... to another location or person.”* — FinCEN

The Privacy Lion relay does **none** of the following:

- Accept funds  
- Transmit funds  
- Act as an intermediary or exchange  
- Pool, custody, or forward funds  
- Commingle user funds or any funds

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

## Important Notes

To maintain legal protection:
- Never custody funds
- Never bundle payments
- Keep payment logic peer-to-peer and stateless

---

## Conclusion

The Privacy Lion relay is a decentralized, non-custodial **data host**. It enforces access based on peer-to-peer Lightning payments, **never accepts funds**, and never acts as an intermediary.

> **Therefore, it is not a money transmitter.**

---

**Legal Contact:** legal@privacy-lion.com  
**Maintainer:** Privacy Lion LLC  
**Last Reviewed:** May 30, 2025
