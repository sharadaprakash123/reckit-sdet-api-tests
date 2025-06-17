# 🐞 Bugs Found

1. GET /products/:id with bad ID returns 500 instead of 404
2. POST /products with missing fields returns 200 instead of 400
3. No rate limiting observed on burst calls