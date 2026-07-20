# Todo

- [x] Temporarily allow all backend endpoints publicly for development/testing.
  - Updated backend security configuration to use `.anyRequest().permitAll()` in `backend/src/main/java/com/hackathon/ETimes/config/SecurityConfiguration.java`.
  - This should be changed back later to restrict access to appropriate endpoints and re-enable authentication.
