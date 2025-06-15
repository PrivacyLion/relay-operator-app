# WHY_NO_CACHE.md

***

**Disclaimer:**  
This document represents the technical design decisions and opinions of the Privacy Lion team.  
It is not affiliated with or endorsed by any external NOSTR clients, protocols, or hosting providers.  
All statements are made in good faith, reflect our current understanding, and are intended for transparency and education.

***

## Why We Don’t Cache User Data

*If privacy is the point, we don’t store what we don’t need.*

Many apps and relays in the NOSTR ecosystem cache user data — sometimes for performance, sometimes for analytics, and sometimes just because that’s how legacy systems work.

Privacy Lion doesn’t cache anything unnecessarily. Our architecture is designed to **minimize data persistence** and **reduce attack surface** by default.

Here’s why we intentionally avoid caching user data:

***

### 1. Caching = Accidental Surveillance

Even short-term caching (in memory, disk, or cloud) can expose users to:

- Metadata logging  
- Re-identification attacks  
- Legal seizure or subpoenas  
- Misuse by developers or third-party tools  

Privacy Lion treats **data minimization as a security model**. If we don’t need it, we don’t keep it — even for milliseconds longer than necessary.

Our relays don’t index or replay user data. Our mobile clients don’t persist anything without explicit user consent.

***

### 2. Ephemeral by Design

Privacy Lion’s mobile and relay architecture follows a **publish-and-forget** model:

- Mobile clients send encrypted events (`kind:30078`) with short TTL (time-to-live) values  
- Relays accept, temporarily store, and expire events automatically  
- Data disappears after a fixed lifespan — no long-term logs, no cold storage

This protects user identity, location history, behavioral patterns, and other sensitive traits — by eliminating persistence before it becomes a risk.

***

### 3. Caching Creates Centralized Behavior

Once you start caching:
- You start relying on centralized memory stores or local disk  
- You start optimizing for speed over sovereignty  
- You lose the lightweight, stateless nature of NOSTR  

That’s not what we’re building.

We’re here to **let users share and monetize their data on their terms — not ours.**

***

### What We Do Instead

- Use short-lived encrypted NOSTR events  
- Strip unnecessary metadata at the edge  
- Temporarily hold events in memory only while actively relaying them to connected clients — never written to disk  
- Expire or delete data on schedule using relay-controlled timers  
- Rely on cryptographic signatures — not persistent session state  

This keeps Privacy Lion:

- Stateless  
- Self-sovereign  
- Resistant to forensic data recovery  
- Compliant with strong privacy expectations  

***
