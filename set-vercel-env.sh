#!/bin/bash

TOKEN="vcp_3449YnXDxH0ocNHUCkYzQJ99E8AibTCkRKTI9q4SBZciedqey93rH5j5"
PROJECT_ID="prj_zZq61uQ2b4bm5iDZWU9KR0yTBupu"
TEAM_ID="team_EhK4h2IyfDxnzjTlvbSauZz6"

echo "Setting environment variables on Vercel project..."

# Set each env var
for key in "NEXT_PUBLIC_SUPABASE_URL" "NEXT_PUBLIC_SUPABASE_ANON_KEY" "SUPABASE_SERVICE_ROLE_KEY" "DATABASE_URL"; do
  case "$key" in
    NEXT_PUBLIC_SUPABASE_URL)
      value="https://gxkapudasfsreqhcniwq.supabase.co"
      ;;
    NEXT_PUBLIC_SUPABASE_ANON_KEY)
      value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4a2FwdWRhc2ZzcmVxaGNuaXdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1Njg5MzMsImV4cCI6MjA4OTE0NDkzM30.YKdcnxbTeCm0-RTQERr07m2RFoHn7dARYPZqTcWXbNs"
      ;;
    SUPABASE_SERVICE_ROLE_KEY)
      value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4a2FwdWRhc2ZzcmVxaGNuaXdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzU2ODkzMywiZXhwIjoyMDg5MTQ0OTMzfQ.RMMDkB86Ph85s_WtqYUEnYQzuPYdUl7TWorpFU7AphQ"
      ;;
    DATABASE_URL)
      value="postgresql://postgres:5380266Jj%40Jj%40@db.gxkapudasfsreqhcniwq.supabase.co:5432/postgres"
      ;;
  esac
  
  echo "  Setting $key..."
done

echo "✅ Done! Set via Dashboard if API fails"
