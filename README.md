# n8n-nodes-sequence

An [n8n](https://n8n.io) community node for the [Sequence](https://getsequence.io) Platform v1 API ([API reference](https://app.getsequence.io/api/platform/)).

Automate money movement and read financial data from your Sequence account: list accounts, create ACH transfers, trigger rules, and read transfers, rule executions, card transactions, and external transactions.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/sustainable-use-license/) workflow automation platform.

## Installation

Self-hosted n8n: **Settings → Community Nodes → Install** and enter `n8n-nodes-sequence`. See the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/).

## Credentials

Create a **Sequence API** credential:

- **API Key** — a Sequence API key (`sk_...`), sent as `Authorization: Bearer <key>`. Create one in the Sequence app under [Account → API Keys](https://app.getsequence.io/account/api-keys).

Keys are scoped. Grant the minimum permissions for the operations you use:

| Operation | Required scope |
| --- | --- |
| Account → Get Many / Get | `READ_ACCOUNTS` |
| Account → List Transfers | `READ_TRANSFERS` |
| Transfer → Get Many / Get | `READ_TRANSFERS` |
| Transfer → Create | `MANUAL_TRANSFER` |
| Rule → Get Many / Get | `READ_RULES` |
| Rule → Trigger | `TRIGGER_RULES` |
| Rule Execution → Get Many / Get | `READ_RULES` |
| Card Transaction → Get Many | `READ_TRANSFERS` |
| External Transaction → Get Many | `READ_TRANSFERS` |

## Operations

- **Account** — Get Many, Get, List Transfers
- **Transfer** — Create, Get Many, Get
- **Rule** — Get Many, Get, Trigger
- **Rule Execution** — Get Many, Get
- **Card Transaction** — Get Many
- **External Transaction** — Get Many

## Dry run (simulation)

`Transfer → Create` and `Rule → Trigger` both default the **Simulation (Dry Run)** toggle to **on**. While on, the API simulates the operation and returns the projected result (`executionMode: SIMULATION`) without moving real money. Turn it off to move real money; the node shows a 💸 LIVE subtitle and an inline warning when it is off.

> Simulated transfers are persisted but excluded from `LIVE` list reads. Use the **Execution Mode** filter (`SIMULATION` / `ALL`) on the transfer/execution list operations to see them.

## Async operations

Create Transfer and Trigger Rule are asynchronous. Create Transfer returns a transfer with status `PROCESSING`; Trigger Rule returns an `executionId`. Poll **Transfer → Get** or **Rule Execution → Get** (optionally behind a Wait node) to track the final status.

## Rate limits

The Sequence API allows 100 requests/minute per key and returns `429` when exceeded.

List operations with **Return All** page internally at the maximum size (100 per page), so typical lists stay well under the limit. n8n drives that paging loop itself, so there is **no delay between pages**: a Return All over a very large dataset (more than ~100 pages) can still hit `429`. n8n's node-level **Retry On Fail** does not fix this — it restarts the operation from the first page rather than resuming or pacing it.

For datasets that large, page manually instead of using Return All: leave **Return All** off, set **Page** and **Limit**, and drive the loop yourself with a Loop/Wait combination (or a Code node) to space out requests.

## Compatibility

Requires n8n with `n8nNodesApiVersion: 1`. Built with `@n8n/node-cli`.

## Resources

- [Sequence Platform API reference](https://app.getsequence.io/api/platform/)
- [n8n community nodes documentation](https://docs.n8n.io/integrations/#community-nodes)
