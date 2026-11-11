"""Application domain services.

NOTE: Previously exposed `ensure_dev_user`, which auto-created user ID 1 for unauthenticated requests.
That helper has been removed so health endpoints never auto-provision or impersonate accounts.
"""
