# MIT6830 Project

## Prerequisites
```
node.js
npm
psql
```

## Get Started

### Install Dependencies
```
npm install request
npm install pg pg-cursor
```

### Toy Database Setup
```shell
# Open a terminal and log into psql as user: postgres
psql -U postgres
```

```sql
-- Create a table called scores
CREATE TABLE scores (
    sid int PRIMARY KEY,
    math int NOT NULL,
    phys int NOT NULL,
    chem int NOT NULL,
    bio int NOT NULL);

-- Insert toy data into the table
INSERT INTO scores (sid, math, phys, chem, bio)
SELECT i, round(random()*100), round(random()*100), round(random()*100), round(random()*100)
FROM generate_series(1, 60000000) s(i);

-- (Optional) Output the table as csv to <file_path>
COPY scores TO '<file_path>';
```