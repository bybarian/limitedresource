# Security Specification for Evaluation Dashboard

## Data Invariants
1. An evaluation must be linked to a valid authenticated user.
2. Only the owner of the `userId` can read or write the data in `/evaluations/{userId}`.
3. `updatedAt` must always be the server time.
4. Scores must be objects containing numeric values.

## The Dirty Dozen Payloads (Negative Tests)
1. **Unauthenticated Read**: Attempt to get any document without logging in. (Denied)
2. **Identity Spoofing (Read)**: User A tries to read `/evaluations/UserB`. (Denied)
3. **Identity Spoofing (Write)**: User A tries to write to `/evaluations/UserB`. (Denied)
4. **Shadow Field Injection**: Adding an `isAdmin: true` field to the evaluation. (Denied by strict schema)
5. **Timestamp Fraud**: Sending a manual string for `updatedAt`. (Denied by server timestamp check)
6. **Orphaned Write**: Trying to create an evaluation with a `userId` that doesn't match the current auth UID. (Denied)
7. **Type Poisoning**: Sending a string instead of a number for a score value. (Denied)
8. **Malicious ID**: Attempting to write to `/evaluations/!@#$%^&*`. (Denied by ID validation)
9. **Bulk Update Bypass**: Attempting to delete the `userId` field during update. (Denied, field is immutable)
10. **Resource Exhaustion**: Sending a 1MB string in one of the score fields. (Denied by size constraints)
11. **Negative Score**: Sending a negative number for a score. (Denied)
12. **Null Scores**: Setting scores to `null`. (Denied)

## Test Runner (Draft)
```ts
// firestore.rules.test.ts (conceptual)
// 1. authenticate as user1
// 2. set evaluations/user1 -> should pass
// 3. authenticate as user2
// 4. get evaluations/user1 -> should fail
// 5. write evaluations/user1 { userId: 'user2' } -> should fail
```
