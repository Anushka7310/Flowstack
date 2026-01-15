# Setup Instructions

## Step 1: Create `.env.local` File

Create a file named `.env.local` in the root directory (same level as `package.json`):

```bash
cp .env.example .env.local
```

## Step 2: Set Up MongoDB Atlas

### Option A: Free MongoDB Atlas (Recommended for Development)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for a free account
3. Create a new project
4. Create a free M0 cluster:
   - Click "Create" → Choose "M0 Free"
   - Select your region
   - Click "Create Cluster"
5. Wait for cluster to be created (2-3 minutes)

### Step 3: Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Select "Node.js" and version "4.0 or later"
4. Copy the connection string
5. Replace `<password>` with your database password
6. Replace `myFirstDatabase` with `healthcare`

Example:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/healthcare?retryWrites=true&w=majority
```

### Step 4: Create Database User

1. Go to "Database Access" in MongoDB Atlas
2. Click "Add New Database User"
3. Create a user:
   - Username: `healthcareapp`
   - Password: Generate a strong password
   - Database User Privileges: "Read and write to any database"
4. Click "Add User"

### Step 5: Whitelist Your IP

1. Go to "Network Access" in MongoDB Atlas
2. Click "Add IP Address"
3. Choose "Allow Access from Anywhere" (0.0.0.0/0) for development
4. Click "Confirm"

## Step 6: Update `.env.local`

Edit `.env.local` and add:

```env
MONGODB_URI=mongodb+srv://healthcareapp:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/healthcare?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-at-least-32-characters-long-change-this
JWT_EXPIRES_IN=7d
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

**Generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 7: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart it
npm run dev
```

## Step 8: Test Registration

1. Open `http://localhost:3000`
2. Click "Register"
3. Fill in the form
4. Submit

If you get an error about MongoDB connection, check:
- ✅ `.env.local` file exists in root directory
- ✅ `MONGODB_URI` is correct
- ✅ Database user password is correct
- ✅ IP is whitelisted in MongoDB Atlas
- ✅ Development server was restarted after creating `.env.local`

## Troubleshooting

### "Database connection failed" Error

**Check:**
1. Is `.env.local` in the root directory?
2. Is `MONGODB_URI` set correctly?
3. Can you connect to MongoDB Atlas from your browser?
4. Did you restart the dev server after creating `.env.local`?

### "MongoServerError: bad auth"

**Solution:**
- Check your password in the connection string
- Special characters need to be URL-encoded
- Example: `@` becomes `%40`, `:` becomes `%3A`

### "MongoServerError: connect ECONNREFUSED"

**Solution:**
- Check your IP is whitelisted in MongoDB Atlas
- Use "Allow Access from Anywhere" (0.0.0.0/0) for development

### Still Getting HTML Error?

Check the browser console (F12 → Console tab) for the actual error message. It will show what went wrong.

## Next Steps

Once registration works:

1. **Register a patient account**
   - Email: patient@example.com
   - Password: Patient123 (must have uppercase, lowercase, number)

2. **Register a provider account**
   - Email: provider@example.com
   - Password: Provider123

3. **Login** with either account

4. **Explore the dashboard**

## Need Help?

If you're still stuck:

1. Check the terminal where `npm run dev` is running for error messages
2. Open browser DevTools (F12) and check the Network tab
3. Look at the API response in the Network tab to see the actual error

The error message will tell you exactly what's wrong!
