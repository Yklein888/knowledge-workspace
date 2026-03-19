# Knowledge Workspace — Complete Setup Script (Windows PowerShell)
# Run as: .\RUN_SETUP.ps1

Write-Host "🚀 Knowledge Workspace Setup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Step 1: Verify .env.local exists
Write-Host "📋 Step 1: Check environment configuration..." -ForegroundColor Blue
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ Error: .env.local not found" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please follow these steps:" -ForegroundColor Yellow
    Write-Host "1. Visit: https://app.supabase.com" -ForegroundColor White
    Write-Host "2. Create a new project (name: 'knowledge-workspace')" -ForegroundColor White
    Write-Host "3. Go to Settings → API" -ForegroundColor White
    Write-Host "4. Copy these values:" -ForegroundColor White
    Write-Host "   - Project URL → NEXT_PUBLIC_SUPABASE_URL" -ForegroundColor Cyan
    Write-Host "   - anon public → NEXT_PUBLIC_SUPABASE_ANON_KEY" -ForegroundColor Cyan
    Write-Host "   - Service Role Secret → SUPABASE_SERVICE_ROLE_KEY" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "5. Edit .env.local with your credentials" -ForegroundColor White
    Write-Host "6. Run this script again" -ForegroundColor White
    Write-Host ""
    exit 1
}
Write-Host "✅ .env.local found" -ForegroundColor Green
Write-Host ""

# Step 2: Verify Supabase credentials
Write-Host "🔑 Step 2: Verify Supabase credentials..." -ForegroundColor Blue
$envContent = Get-Content ".env.local" -Raw
$hasUrl = $envContent -match "NEXT_PUBLIC_SUPABASE_URL=https://"
$hasAnonKey = $envContent -match "NEXT_PUBLIC_SUPABASE_ANON_KEY=ey"
$hasServiceKey = $envContent -match "SUPABASE_SERVICE_ROLE_KEY=ey"

if (-not ($hasUrl -and $hasAnonKey -and $hasServiceKey)) {
    Write-Host "❌ Error: Incomplete Supabase credentials" -ForegroundColor Red
    Write-Host ""
    Write-Host "Make sure .env.local contains all three keys:" -ForegroundColor Yellow
    Write-Host "  - NEXT_PUBLIC_SUPABASE_URL" -ForegroundColor Cyan
    Write-Host "  - NEXT_PUBLIC_SUPABASE_ANON_KEY" -ForegroundColor Cyan
    Write-Host "  - SUPABASE_SERVICE_ROLE_KEY" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}
Write-Host "✅ Credentials configured" -ForegroundColor Green
Write-Host ""

# Step 3: Install dependencies
Write-Host "📦 Step 3: Install dependencies..." -ForegroundColor Blue
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing npm packages..." -ForegroundColor Cyan
    npm install --legacy-peer-deps
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ npm install failed" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}
Write-Host ""

# Step 4: Push database schema
Write-Host "🗄️  Step 4: Deploy database schema..." -ForegroundColor Blue
Write-Host "Creating tables in Supabase..." -ForegroundColor Cyan
npx dotenv -e .env.local -- npx drizzle-kit push

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Database schema push failed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "- Verify Supabase credentials in .env.local" -ForegroundColor White
    Write-Host "- Check that Supabase project is fully initialized" -ForegroundColor White
    Write-Host "- Try again in a few moments" -ForegroundColor White
    exit 1
}
Write-Host "✅ Database schema deployed" -ForegroundColor Green
Write-Host ""

# Step 5: Verify TypeScript
Write-Host "✅ Step 5: Verify TypeScript..." -ForegroundColor Blue
npm run type-check
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ TypeScript errors found" -ForegroundColor Red
    exit 1
}
Write-Host "✅ TypeScript verified" -ForegroundColor Green
Write-Host ""

# Step 6: All done!
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next step: Start the development server" -ForegroundColor Yellow
Write-Host ""
Write-Host "  npm run dev" -ForegroundColor Cyan
Write-Host ""
Write-Host "Then:" -ForegroundColor Yellow
Write-Host "  1. Visit http://localhost:3000" -ForegroundColor White
Write-Host "  2. Click 'Get Started'" -ForegroundColor White
Write-Host "  3. Sign up with test@example.com" -ForegroundColor White
Write-Host "  4. Create pages in workspace" -ForegroundColor White
Write-Host ""
Write-Host "To see your data:" -ForegroundColor Yellow
Write-Host "  Visit https://app.supabase.com → Table Editor" -ForegroundColor Cyan
Write-Host ""
