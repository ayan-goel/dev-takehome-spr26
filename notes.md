# Checklist

<!-- Make sure you fill out this checklist with what you've done before submitting! -->

- [ ] Read the README [please please please]
- [ ] Something cool!
- [ ] Back-end
  - [ ] Minimum Requirements
    - [ ] Setup MongoDB database
    - [ ] Setup item requests collection
    - [ ] `PUT /api/request`
    - [ ] `GET /api/request?page=_`
  - [ ] Main Requirements
    - [ ] `GET /api/request?status=pending`
    - [ ] `PATCH /api/request`
  - [ ] Above and Beyond
    - [ ] Batch edits
    - [ ] Batch deletes
- [ ] Front-end
  - [ ] Minimum Requirements
    - [ ] Dropdown component
    - [ ] Table component
    - [ ] Base page [table with data]
    - [ ] Table dropdown interactivity
  - [ ] Main Requirements
    - [ ] Pagination
    - [ ] Tabs
  - [ ] Above and Beyond
    - [ ] Batch edits
    - [ ] Batch deletes

# Notes

## Batch Endpoints

### Batch Edit - `PATCH /api/request/batch`

Updates the status of multiple requests at once.

**Request Body:**
```json
{
  "ids": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
  "status": "approved"
}
```

**Response:**
```json
{
  "modifiedCount": 2
}
```

### Batch Delete - `DELETE /api/request/batch`

Deletes multiple requests at once.

**Request Body:**
```json
{
  "ids": ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"]
}
```

**Response:**
```json
{
  "deletedCount": 2
}
```
