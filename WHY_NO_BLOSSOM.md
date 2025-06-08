# WHY_NO_BLOSSOM.md

***

**Disclaimer:**  
This document represents the technical design decisions and opinions of the Privacy Lion team.  
It is not affiliated with or endorsed by Blossom or any third-party protocol developers.  
All statements are made in good faith, reflect our current understanding, and are intended for transparency and education.

***

## Why We Don’t Use Blossom

*We believe in real decentralization — not just a hash on a centralized CDN.*

Blossom is a media-sharing protocol for the Nostr ecosystem. It allows users to store and retrieve images, videos, and other large binary files by referencing them through SHA-256 hashes in Nostr events.

At first glance, it appears decentralized. But under the hood, Blossom relies on **centralized HTTP servers** to store and serve the actual files.

We chose not to integrate Blossom into Privacy Lion. Here's why:

***

### 1. Blossom Is Centralized Behind the Scenes

While the **hash of the file** is decentralized (published in a Nostr event), the actual **file storage and delivery** happens through HTTP — usually hosted by:

- CDN-backed blob servers
- Public mirror endpoints maintained by external parties
- Traditional cloud infrastructure

That means:

- If the host goes down, the file is gone  
- If the host censors you, the file is inaccessible  
- If the host tracks access, your privacy is compromised  

**Blossom is not decentralized in any meaningful sense — it's hash-verified centralized storage.**

***

### 2. Media Isn't Our Use Case

Privacy Lion is not a media-sharing platform.

We’re building a **decentralized data vending system** focused on:

- Structured personal data (contacts, location, calendar, etc.)  
- Small encrypted payloads  
- Expiring, ephemeral data  
- Consent-first, pay-to-unlock access  

We don’t accept media blobs, and our relays don’t serve files over HTTP.  
**We are simple by design. Private by default.**

***

### 3. We Won’t Redefine “Decentralization”

Blossom attempts to retrofit centralized infrastructure into a decentralized protocol — and calls it a win.

We believe that’s misleading.

**Real decentralization means:**

- No dependency on third-party infrastructure  
- No centralized file serving  
- No hidden chokepoints  

You can’t decentralize by outsourcing media storage to a CDN and slapping a hash on it.  
That’s not peer-to-peer — that’s peer-to-cloud.

***

### What We Do Instead

- We use **Nostr-native encrypted events** (`kind:30078`) for all data  
- We enforce **ephemeral storage** — user data disappears after a set time  
- We let users **control access** via Lightning payments  
- We don’t store media, track blobs, or serve files over HTTP  

This keeps Privacy Lion:

- Lightweight  
- Permissionless  
- Censorship-resistant  
- Truly decentralized  

***

*Want a media CDN? Use Blossom.*  
*Want real privacy and decentralization? Use Privacy Lion.*

***
