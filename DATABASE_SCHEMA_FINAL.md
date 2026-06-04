# Muawin Database Schema (Supabase/PostgreSQL) - Final with Admin Dashboard Requirements

Complete database schema for Muawin - Pakistani household services marketplace

**Project:** Muawin  
**Database:** Supabase (PostgreSQL)  
**User Types:** Customer, Service Provider, Vendor, Admin  
**Admin Dashboard:** Next.js (shares same database)

---

## PART 1: Entity List

### Core User Entities
- `profiles` - Main user profile with common fields (All)
- `customers` - Customer-specific data (Customer)
- `providers` - Service provider-specific data (Service Provider)
- `vendors` - Vendor/store-specific data (Vendor)
- `admin_users` - Admin user accounts (Admin)

### Service & Job Entities
- `service_categories` - Service categories (System)
- `job_requests` - Job postings (Customer creates, Provider views publicly)
- `direct_job_requests` - Direct requests to specific providers (Customer creates, Provider receives)
- `jobs` - Active, scheduled, completed, cancelled jobs (Customer, Provider)

### Financial Entities
- `payments` - Payment records (Customer, Provider, Vendor)
- `transactions` - Transaction history (Customer, Provider, Vendor)
- `wallets` - Provider/vendor wallet balances (Provider, Vendor)
- `withdrawals` - Withdrawal requests (Provider, Vendor)
- `subscriptions` - PRO subscription records (Customer, Provider, Vendor)
- `featured_ads` - Featured ad purchases (Provider, Vendor)

### Communication Entities
- `notifications` - Notification records (All)
- `message_threads` - Conversation threads (All)
- `messages` - Individual chat messages (All)

### Reviews & Feedback
- `reviews` - Customer reviews (Customer creates, Provider/Vendor receives)
- `favorites` - Customer favorite providers/vendors (Customer creates)

### Verification Entities
- `documents` - Uploaded file metadata (All)
- `verifications` - Document verification records (Provider, Vendor)
- `verification_logs` - Verification status history (Provider, Vendor)
- `otp_verifications` - OTP verification records (All)
- `face_match_results` - AI face match analysis results (Provider, Vendor) **[NEW - ADMIN SPECIFIC]**

### Pricing Entities
- `service_pricing_packages` - Provider pricing packages (Basic, Standard, Premium) (Provider)

### Support Entities
- `complaints` - Customer complaints (Customer creates, Admin manages)
- `complaint_actions` - Admin actions on complaints (Admin)

### Emergency Entities
- `emergency_contacts` - Provider emergency contacts (Provider)
- `emergency_alerts` - SOS emergency alerts (Provider creates, Admin receives)

### Admin-Specific Entities **[NEW]**
- `admin_audit_logs` - Detailed admin action audit trail (Admin only)
- `admin_notes` - Admin notes on users/verifications/complaints (Admin only)
- `account_flags` - Account flags and warnings (Admin only)
- `account_bans` - Account ban records (Admin only)
- `payment_proofs` - Bank transfer proof images for subscriptions/featured ads (Admin only)
- `withdrawal_execution_logs` - Detailed withdrawal execution records (Admin only)

### System Entities
- `audit_logs` - System audit logs (System)
- `system_settings` - App configuration (Admin)
- `ai_analysis_cache` - Cached AI analysis (System)

---

## PART 2: Entity Relationship Diagram

### User Authentication Flow
```
[auth.users] 1:1 [profiles]
                    |
      +------------+------------+------------+
      |            |            |            |
   1:1          1:1          1:1          1:1
      |            |            |            |
 [customers] [providers]  [vendors] [admin_users]
```

### Core Relationships
```
[customers] 1:N [job_requests] N:1 [service_categories]
[customers] 1:N [direct_job_requests] N:1 [providers]
[customers] 1:N [jobs] N:1 [providers]
[customers] 1:N [reviews] N:1 [providers]
[customers] 1:N [favorites] N:1 [providers]
[customers] 1:N [favorites] N:1 [vendors]
[customers] 1:N [complaints] N:1 [providers]
[customers] 1:N [messages] M:N [providers] (via message_threads)
[customers] 1:N [subscriptions] 1:1
[providers] 1:N [direct_job_requests] N:1 [customers]
[providers] 1:N [jobs] N:1 [customers]
[providers] 1:N [reviews] N:1 [customers]
[providers] 1:N [wallets] 1:1
[providers] 1:N [withdrawals] 1:1
[providers] 1:N [verifications] 1:1
[providers] 1:N [documents] 1:N
[providers] 1:N [service_pricing_packages] 1:N
[providers] 1:N [emergency_contacts] 1:1
[providers] 1:N [emergency_alerts] 1:1
[providers] 1:N [featured_ads] 1:1
[vendors] 1:N [documents] 1:N
[vendors] 1:N [featured_ads] 1:1
```

### Financial Relationships
```
[jobs] 1:1 [payments]
[direct_job_requests] 1:1 [payments]
[wallets] 1:N [transactions] 1:1
[withdrawals] 1:1 [transactions]
[subscriptions] 1:1 [payments]
[featured_ads] 1:1 [payments]
```

### Admin-Specific Relationships **[NEW]**
```
[admin_users] 1:N [admin_audit_logs]
[admin_users] 1:N [admin_notes]
[admin_users] 1:N [account_flags]
[admin_users] 1:N [account_bans]
[admin_users] 1:N [withdrawal_execution_logs]
[verifications] 1:1 [face_match_results]
[subscriptions] 1:N [payment_proofs]
[featured_ads] 1:N [payment_proofs]
[profiles] 1:N [admin_notes]
[complaints] 1:N [admin_notes]
```

---

## PART 3: Complete Relational Schema

### Predefined Categories

**Service Provider Categories (9 total):**
- Maid
- Driver
- Babysitter
- Security Guard
- Washerman
- Domestic Helper
- Cook
- Gardener
- Tutor

**Vendor Categories (7 total):**
- Supermarket
- Meatshop
- Milkshop
- Water Plant
- Gas Cylinder Shop
- Fruits and Vegetables Market
- Bakery

These categories are pre-populated in the `service_categories` table during initial database setup.

---

### auth.users (Supabase Managed)
```
id (UUID PK), email (TEXT UNIQUE NOT NULL), encrypted_password (TEXT NOT NULL),
email_confirmed_at (TIMESTAMP), invited_at (TIMESTAMP), created_at (TIMESTAMP)
```

### profiles
```
id (UUID PK), user_id (UUID FK→auth.users UNIQUE NOT NULL),
full_name (TEXT NOT NULL), email (TEXT NOT NULL), phone_number (TEXT NOT NULL),
profile_image_url (TEXT), location (TEXT), address (TEXT), city (TEXT), area (TEXT),
latitude (DOUBLE), longitude (DOUBLE), language (TEXT default 'English'),
role (TEXT NOT NULL CHECK IN ('customer','provider','vendor','admin')),
is_active (BOOLEAN default true), is_suspended (BOOLEAN default false), **[NEW]**
suspension_reason (TEXT), suspension_until (TIMESTAMP), **[NEW]**
device_token (TEXT), last_seen_at (TIMESTAMP), **[NEW]**
created_at (TIMESTAMP), updated_at (TIMESTAMP)
```

### customers
```
id (UUID PK), profile_id (UUID FK→profiles UNIQUE NOT NULL),
preferences (JSONB default '{}'), notification_settings (JSONB default '{}'),
language (TEXT default 'English', CHECK (language IN ('English', 'Urdu', 'Bilingual'))),
is_pro (BOOLEAN default false), pro_expiry_date (TIMESTAMP),
created_at (TIMESTAMP), updated_at (TIMESTAMP)
```

### providers
```
id (UUID PK), profile_id (UUID FK→profiles UNIQUE NOT NULL),
service_category (TEXT NOT NULL), tagline (TEXT),
experience_years (INTEGER default 0), hourly_rate (DECIMAL(10,2)),
location (TEXT), address (TEXT), city (TEXT), area (TEXT),
latitude (DOUBLE PRECISION), longitude (DOUBLE PRECISION),
language (TEXT default 'English', CHECK (language IN ('English', 'Urdu', 'Bilingual'))),
is_available (BOOLEAN default true), is_verified (BOOLEAN default false),
verification_status (TEXT default 'pending', CHECK (verification_status IN ('pending', 'verified', 'rejected'))),
cnic_number (TEXT), cnic_expiry_date (DATE),
rating (DECIMAL(3,2) default 0.0, CHECK (rating >= 0 AND rating <= 5)),
review_count (INTEGER default 0), completed_jobs (INTEGER default 0),
is_pro (BOOLEAN default false), pro_expiry_date (TIMESTAMP),
warning_count (INTEGER default 0), **[NEW]**
flag_count (INTEGER default 0), **[NEW]**
created_at (TIMESTAMP), updated_at (TIMESTAMP)
```

### vendors
```
id (UUID PK), profile_id (UUID FK→profiles UNIQUE NOT NULL),
business_name (TEXT NOT NULL), business_type (TEXT NOT NULL),
years_in_business (INTEGER default 0), location (TEXT), address (TEXT),
city (TEXT), area (TEXT), latitude (DOUBLE PRECISION), longitude (DOUBLE PRECISION),
language (TEXT default 'English', CHECK (language IN ('English', 'Urdu', 'Bilingual'))),
is_verified (BOOLEAN default false), verification_status (TEXT default 'pending', CHECK (verification_status IN ('pending', 'verified', 'rejected'))),
cnic_number (TEXT), cnic_expiry_date (DATE),
rating (DECIMAL(3,2) default 0.0, CHECK (rating >= 0 AND rating <= 5)),
review_count (INTEGER default 0), is_pro (BOOLEAN default false), pro_expiry_date (TIMESTAMP),
warning_count (INTEGER default 0), **[NEW]**
flag_count (INTEGER default 0), **[NEW]**
created_at (TIMESTAMP), updated_at (TIMESTAMP)
```

### admin_users
```
id (UUID PK), profile_id (UUID FK→profiles UNIQUE NOT NULL),
admin_level (TEXT NOT NULL CHECK IN ('super_admin','admin','moderator')),
permissions (JSONB default '{}'), created_at (TIMESTAMP), updated_at (TIMESTAMP)
```

### service_categories
```
id (UUID PK), name (TEXT UNIQUE NOT NULL), name_urdu (TEXT), icon (TEXT),
description (TEXT), is_active (BOOLEAN default true), sort_order (INTEGER default 0),
created_at (TIMESTAMP), updated_at (TIMESTAMP)
```

### job_requests
```
id (UUID PK), customer_id (UUID FK→customers NOT NULL),
service_category (TEXT FK→service_categories NOT NULL), title (TEXT NOT NULL),
description (TEXT NOT NULL), location (TEXT NOT NULL), city (TEXT), area (TEXT),
latitude (DOUBLE), longitude (DOUBLE), budget (DECIMAL(10,2)),
is_urgent (BOOLEAN default false), scheduled_date (DATE), scheduled_time (TIME),
status (TEXT default 'open' CHECK IN ('open','in_progress','completed','cancelled')),
accepted_by (UUID FK→providers), accepted_at (TIMESTAMP),
expires_at (TIMESTAMP), created_at (TIMESTAMP), updated_at (TIMESTAMP)
```

### direct_job_requests
```
id (UUID PK), customer_id (UUID FK→customers NOT NULL),
provider_id (UUID FK→providers NOT NULL),
service_category (TEXT NOT NULL), title (TEXT NOT NULL),
description (TEXT NOT NULL), location (TEXT NOT NULL), city (TEXT), area (TEXT),
latitude (DOUBLE), longitude (DOUBLE), 
package_type (TEXT), proposed_price (DECIMAL(10,2)), 
special_instructions (TEXT), negotiation_notes (TEXT),
scheduled_date (DATE), scheduled_time (TIME),
duration_type (TEXT), is_priority_response (BOOLEAN default false),
is_nda_required (BOOLEAN default false), custom_budget_min (DECIMAL(10,2)),
custom_budget_max (DECIMAL(10,2)),
customer_is_pro (BOOLEAN default false), platform_fee_percentage (DECIMAL(5,2) default 10.0),
status (TEXT default 'pending' CHECK IN ('pending','accepted','rejected','negotiating','cancelled')),
created_at (TIMESTAMP), updated_at (TIMESTAMP)
```

### jobs
```
id (UUID PK), job_request_id (UUID FK→job_requests),
direct_request_id (UUID FK→direct_job_requests),
customer_id (UUID FK→customers NOT NULL), provider_id (UUID FK→providers NOT NULL),
service_category (TEXT NOT NULL), title (TEXT NOT NULL), description (TEXT NOT NULL),
location (TEXT NOT NULL), city (TEXT), area (TEXT),
latitude (DOUBLE PRECISION), longitude (DOUBLE PRECISION),
scheduled_date (DATE), scheduled_time (TIME),
status (TEXT NOT NULL CHECK IN ('active','scheduled','completed','cancelled')),
completion_date (DATE), completion_time (TIME), rating (DECIMAL(3,2)),
review (TEXT), cancel_date (DATE), cancel_reason (TEXT), cancel_description (TEXT),
created_at (TIMESTAMP), updated_at (TIMESTAMP)
```

### payments
```
id (UUID PK), job_id (UUID FK→jobs), direct_request_id (UUID FK→direct_job_requests),
subscription_id (UUID FK→subscriptions), featured_ad_id (UUID FK→featured_ads),
payer_id (UUID FK→profiles NOT NULL), receiver_id (UUID FK→profiles),
amount (DECIMAL(10,2) NOT NULL), currency (TEXT default 'PKR'),
payment_method (TEXT NOT NULL), payment_status (TEXT default 'pending'),
transaction_id (TEXT UNIQUE), payment_date (TIMESTAMP),
escrow_status TEXT DEFAULT 'pending' CHECK (escrow_status IN ('pending','held','released','refunded')),
released_at TIMESTAMP, refunded_at TIMESTAMP, refund_reason TEXT,
created_at (TIMESTAMP), updated_at (TIMESTAMP)
```

### transactions
```
id (UUID PK), wallet_id (UUID FK→wallets), withdrawal_id (UUID FK→withdrawals),
payment_id (UUID FK→payments), user_id (UUID FK→profiles NOT NULL),
type (TEXT NOT NULL CHECK IN ('credit','debit')), amount (DECIMAL(10,2) NOT NULL),
balance_after (DECIMAL(10,2) NOT NULL), description (TEXT), created_at (TIMESTAMP)
```

### wallets
```
id (UUID PK), provider_id (UUID FK→providers), vendor_id (UUID FK→vendors), **[UPDATED]**
balance (DECIMAL(10,2) default 0.00 CHECK >= 0), total_earnings (DECIMAL(10,2) default 0.00), **[NEW]**
currency (TEXT default 'PKR'),
is_active (BOOLEAN default true), created_at (TIMESTAMP), updated_at (TIMESTAMP)
```

### withdrawals
```
id (UUID PK), wallet_id (UUID FK→wallets NOT NULL), provider_id (UUID FK→providers),
vendor_id (UUID FK→vendors), **[UPDATED]**
amount (DECIMAL(10,2) NOT NULL), withdrawal_method (TEXT NOT NULL),
account_details (JSONB NOT NULL), status (TEXT default 'pending'), rejection_reason (TEXT),
processed_at (TIMESTAMP), created_at (TIMESTAMP), updated_at (TIMESTAMP)
```

### subscriptions
```
id (UUID PK), customer_id (UUID FK→customers), provider_id (UUID FK→providers),
vendor_id (UUID FK→vendors), **[UPDATED]**
plan_name (TEXT NOT NULL), plan_price (DECIMAL(10,2) NOT NULL),
plan_period (TEXT NOT NULL), start_date (DATE NOT NULL), end_date (DATE NOT NULL),
is_active (BOOLEAN default true), auto_renew (BOOLEAN default false),
created_at (TIMESTAMP), updated_at (TIMESTAMP)
```

### featured_ads
```
id (UUID PK), provider_id (UUID FK→providers), vendor_id (UUID FK→vendors),
ad_type (TEXT NOT NULL), tagline (TEXT), start_date (DATE NOT NULL),
end_date (DATE NOT NULL), is_active (BOOLEAN default true),
plan_type (TEXT), plan_price (DECIMAL(10,2)), payment_method (TEXT),
payment_status (TEXT default 'pending'), impressions (INTEGER default 0),
clicks (INTEGER default 0), user_type (TEXT CHECK IN ('provider','vendor')),
created_at (TIMESTAMP), updated_at (TIMESTAMP)
```

### notifications
```
id (UUID PK), user_id (UUID FK→profiles NOT NULL), type (TEXT NOT NULL),
title (TEXT NOT NULL), body (TEXT NOT NULL), priority (TEXT default 'medium'),
category (TEXT), is_read (BOOLEAN default false), action_type (TEXT),
action_data (JSONB), created_at (TIMESTAMP), updated_at (TIMESTAMP)
```

### message_threads
```
id (UUID PK), participant_1_id (UUID FK→profiles NOT NULL),
participant_2_id (UUID FK→profiles NOT NULL), job_id (UUID FK→jobs),
last_message_at (TIMESTAMP), is_active (BOOLEAN default true),
created_at (TIMESTAMP), updated_at (TIMESTAMP)
```

### messages
```
id (UUID PK), thread_id (UUID FK→message_threads NOT NULL),
sender_id (UUID FK→profiles NOT NULL), content (TEXT NOT NULL),
message_type (TEXT default 'text'), is_voice_message (BOOLEAN default false),
is_read (BOOLEAN default false), created_at (TIMESTAMP)
```

### reviews
```
id (UUID PK), customer_id (UUID FK→customers NOT NULL), provider_id (UUID FK→providers),
vendor_id (UUID FK→vendors), job_id (UUID FK→jobs),
rating (DECIMAL(3,2) NOT NULL CHECK >= 0 AND <= 5), review (TEXT),
is_verified (BOOLEAN default false), created_at (TIMESTAMP), updated_at (TIMESTAMP)
```

### favorites
```
id (UUID PK), customer_id (UUID FK→customers NOT NULL),
provider_id (UUID FK→providers), vendor_id (UUID FK→vendors),
UNIQUE(customer_id, provider_id), UNIQUE(customer_id, vendor_id), **[NEW]**
created_at (TIMESTAMP)
```

### documents
```
id (UUID PK), uploaded_by (UUID FK→profiles NOT NULL),
provider_id (UUID FK→providers), vendor_id (UUID FK→vendors),
verification_id (UUID FK→verifications),
file_name (TEXT NOT NULL), file_type (TEXT NOT NULL),
file_size (INTEGER), file_url (TEXT NOT NULL),
storage_path (TEXT), mime_type (TEXT),
category (TEXT), description (TEXT),
is_verified (BOOLEAN default false),
created_at (TIMESTAMP), updated_at (TIMESTAMP)
```

### verifications
```
id (UUID PK), provider_id (UUID FK→providers), vendor_id (UUID FK→vendors),
document_type (TEXT NOT NULL), document_url (TEXT NOT NULL),
cnic_url (TEXT), selfie_url (TEXT),
status (TEXT default 'pending'), rejection_reason (TEXT),
verified_by (UUID FK→admin_users), verified_at (TIMESTAMP), expiry_date (DATE),
created_at (TIMESTAMP), updated_at (TIMESTAMP)
```

### service_pricing_packages
```
id (UUID PK), provider_id (UUID FK→providers NOT NULL),
package_name (TEXT NOT NULL), package_type (TEXT NOT NULL),
price (DECIMAL(10,2) NOT NULL), currency (TEXT default 'PKR'),
duration (TEXT), includes (JSONB default '[]'), **[RENAMED from features]**
is_active (BOOLEAN default true), is_featured (BOOLEAN default false),
description (TEXT), sort_order (INTEGER default 0),
created_at (TIMESTAMP), updated_at (TIMESTAMP)
```

### verification_logs
```
id (UUID PK), verification_id (UUID FK→verifications NOT NULL),
old_status (TEXT), new_status (TEXT NOT NULL), changed_by (UUID FK→admin_users),
notes (TEXT), created_at (TIMESTAMP)
```

### otp_verifications
```
id (UUID PK), user_id (UUID FK→profiles), phone_number (TEXT NOT NULL),
otp_code (TEXT NOT NULL), purpose (TEXT NOT NULL), is_used (BOOLEAN default false),
expires_at (TIMESTAMP NOT NULL), created_at (TIMESTAMP)
```

### complaints
```
id (UUID PK), customer_id (UUID FK→customers NOT NULL), provider_id (UUID FK→providers),
vendor_id (UUID FK→vendors), job_id (UUID FK→jobs),
complaint_type (TEXT NOT NULL), description (TEXT NOT NULL),
status (TEXT default 'open'), priority (TEXT default 'medium'),
assigned_to (UUID FK→admin_users), created_at (TIMESTAMP), updated_at (TIMESTAMP)
```

### complaint_actions
```
id (UUID PK), complaint_id (UUID FK→complaints NOT NULL),
action_type (TEXT NOT NULL), description (TEXT),
taken_by (UUID FK→admin_users NOT NULL), created_at (TIMESTAMP)
```

### emergency_contacts
```
id (UUID PK), provider_id (UUID FK→providers NOT NULL), name (TEXT NOT NULL),
relationship (TEXT NOT NULL), phone_number (TEXT NOT NULL),
is_primary (BOOLEAN default false), created_at (TIMESTAMP), updated_at (TIMESTAMP)
```

### emergency_alerts
```
id (UUID PK), provider_id (UUID FK→providers NOT NULL), job_id (UUID FK→jobs),
location (TEXT), latitude (DOUBLE), longitude (DOUBLE), message (TEXT),
status (TEXT default 'active'), resolved_by (UUID FK→admin_users),
resolved_at (TIMESTAMP), created_at (TIMESTAMP), updated_at (TIMESTAMP)
```

### audit_logs
```
id (UUID PK), user_id (UUID FK→profiles), action (TEXT NOT NULL),
table_name (TEXT NOT NULL), record_id (UUID), old_values (JSONB),
new_values (JSONB), ip_address (TEXT), user_agent (TEXT), created_at (TIMESTAMP)
```

### system_settings
```
id (UUID PK), key (TEXT UNIQUE NOT NULL), value (JSONB NOT NULL),
description (TEXT), updated_at (TIMESTAMP), updated_by (UUID FK→admin_users)
```

### ai_analysis_cache
```
id (UUID PK), provider_id (UUID FK→providers), vendor_id (UUID FK→vendors),
analysis_type (TEXT NOT NULL), input_data (JSONB NOT NULL), result (JSONB NOT NULL),
confidence_score (DECIMAL(5,4)), cache_key (TEXT NOT NULL),
expires_at (TIMESTAMP NOT NULL), created_at (TIMESTAMP)
```

### face_match_results **[NEW - ADMIN SPECIFIC]**
```
id (UUID PK), verification_id (UUID FK→verifications UNIQUE NOT NULL),
decision (TEXT NOT NULL CHECK IN ('MATCH','NO_MATCH','POSSIBLE_MATCH')),
recommendation (TEXT NOT NULL CHECK IN ('APPROVE','REJECT','MANUAL_REVIEW')),
confidence_score (DECIMAL(5,4) NOT NULL), confidence_percentage (TEXT),
distance (DECIMAL(10,6)), is_match (BOOLEAN), threshold_used (DECIMAL(10,6)),
model_used (TEXT), processing_time_ms (INTEGER),
cnic_face_detected (BOOLEAN), selfie_face_detected (BOOLEAN),
cnic_face_confidence (DECIMAL(5,4)), selfie_face_confidence (DECIMAL(5,4)),
cnic_face_location (JSONB), image_quality (JSONB),
cnic_url (TEXT), selfie_url (TEXT),
created_at (TIMESTAMP)
```

### admin_audit_logs **[NEW - ADMIN SPECIFIC]**
```
id (UUID PK), admin_user_id (UUID FK→admin_users NOT NULL),
action_type (TEXT NOT NULL), target_entity_type (TEXT NOT NULL),
target_entity_id (UUID), action_details (JSONB),
ip_address (TEXT), user_agent (TEXT), created_at (TIMESTAMP)
```

### admin_notes **[NEW - ADMIN SPECIFIC]**
```
id (UUID PK), admin_user_id (UUID FK→admin_users NOT NULL),
target_profile_id (UUID FK→profiles), target_complaint_id (UUID FK→complaints),
target_verification_id (UUID FK→verifications), note (TEXT NOT NULL),
is_private (BOOLEAN default false), created_at (TIMESTAMP), updated_at (TIMESTAMP)
```

### account_flags **[NEW - ADMIN SPECIFIC]**
```
id (UUID PK), profile_id (UUID FK→profiles NOT NULL),
flagged_by (UUID FK→admin_users NOT NULL), flag_reason (TEXT NOT NULL),
flag_type (TEXT NOT NULL CHECK IN ('warning','monitor','investigation')),
is_active (BOOLEAN default true), expires_at (TIMESTAMP),
created_at (TIMESTAMP), updated_at (TIMESTAMP)
```

### account_bans **[NEW - ADMIN SPECIFIC]**
```
id (UUID PK), profile_id (UUID FK→profiles NOT NULL),
banned_by (UUID FK→admin_users NOT NULL), ban_reason (TEXT NOT NULL),
ban_duration (TEXT NOT NULL CHECK IN ('7days','30days','permanent')),
permanent_confirmed (BOOLEAN default false), is_active (BOOLEAN default true),
expires_at (TIMESTAMP), created_at (TIMESTAMP), updated_at (TIMESTAMP)
```

### payment_proofs **[NEW - ADMIN SPECIFIC]**
```
id (UUID PK), subscription_id (UUID FK→subscriptions), featured_ad_id (UUID FK→featured_ads),
proof_image_url (TEXT NOT NULL), uploaded_by (UUID FK→profiles NOT NULL),
verified_by (UUID FK→admin_users), is_verified (BOOLEAN default false),
verification_notes (TEXT), created_at (TIMESTAMP), updated_at (TIMESTAMP)
```

### withdrawal_execution_logs **[NEW - ADMIN SPECIFIC]**
```
id (UUID PK), withdrawal_id (UUID FK→withdrawals UNIQUE NOT NULL),
executed_by (UUID FK→admin_users NOT NULL), payout_method (TEXT NOT NULL),
bank_name (TEXT), account_number (TEXT), account_title (TEXT),
mobile_number (TEXT), wallet_type (TEXT),
payout_amount (DECIMAL(10,2) NOT NULL), fee_amount (DECIMAL(10,2) NOT NULL),
net_payout (DECIMAL(10,2) NOT NULL), transaction_reference (TEXT),
execution_status (TEXT NOT NULL CHECK IN ('success','failed')),
failure_reason (TEXT), payment_proof_url (TEXT), notes (TEXT), created_at (TIMESTAMP)
```

---

## PART 4: Junction Tables

**No junction tables required** - All relationships implemented via foreign keys:
- Messages between users: `message_threads` table connects two `profiles` 
- Jobs: Direct foreign keys to `customers` and `providers` 
- Reviews: Direct foreign keys with optional provider/vendor

---

## PART 5: Supabase Auth Integration

### Auth Flow
```
auth.users → profiles → customers/providers/vendors/admin_users
```

### Trigger Function
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, phone_number, role, is_active)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
          NEW.email, COALESCE(NEW.raw_user_meta_data->>'phone_number', ''),
          COALESCE(NEW.raw_user_meta_data->>'role', 'customer'), true);
  
  IF NEW.raw_user_meta_data->>'role' = 'customer' THEN
    INSERT INTO public.customers (profile_id) SELECT id FROM public.profiles WHERE user_id = NEW.id;
  ELSIF NEW.raw_user_meta_data->>'role' = 'provider' THEN
    INSERT INTO public.providers (profile_id, service_category)
    SELECT id, COALESCE(NEW.raw_user_meta_data->>'service_category', 'General')
    FROM public.profiles WHERE user_id = NEW.id;
  ELSIF NEW.raw_user_meta_data->>'role' = 'vendor' THEN
    INSERT INTO public.vendors (profile_id, business_name)
    SELECT id, COALESCE(NEW.raw_user_meta_data->>'business_name', 'Business')
    FROM public.profiles WHERE user_id = NEW.id;
  ELSIF NEW.raw_user_meta_data->>'role' = 'admin' THEN
    INSERT INTO public.admin_users (profile_id, admin_level)
    SELECT id, 'admin' FROM public.profiles WHERE user_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## PART 6: Row Level Security Summary

**profiles**: own (user_id), admin (all)  
**customers**: own (profile_id), admin (all)  
**providers**: own (profile_id), admin (all), public (verified only)  
**vendors**: own (profile_id), admin (all), public (verified only)  
**admin_users**: admin (all)  
**service_categories**: all (authenticated), public (active only)  
**job_requests**: own customer, admin (all)  
**direct_job_requests**: customer (own), provider (own), admin (all)  
**jobs**: customer (own), provider (own), admin (all)  
**payments**: payer (own), receiver (own), admin (all)  
**transactions**: user (own), admin (all)  
**wallets**: provider (own), vendor (own), admin (all)  
**withdrawals**: provider (own), vendor (own), admin (all)  
**subscriptions**: customer (own), provider (own), vendor (own), admin (all)  
**featured_ads**: owner, admin (all), public (active only)  
**notifications**: recipient (user_id), admin (all)  
**message_threads**: participants, admin (all)  
**messages**: thread participants, admin (all)  
**reviews**: reviewer, reviewed, admin (all), public (verified only)  
**favorites**: customer (own), admin (all)  
**documents**: uploader (own), provider (own), vendor (own), admin (all)  
**verifications**: owner, admin (all)  
**verification_logs**: admin (all)  
**otp_verifications**: user, admin (all)  
**service_pricing_packages**: provider (own), admin (all), public (active only)  
**complaints**: complainant, complained, admin (all)  
**complaint_actions**: admin (all)  
**emergency_contacts**: provider, admin (all)  
**emergency_alerts**: provider, admin (all)  
**audit_logs**: admin (all)  
**system_settings**: admin (all), public (non-sensitive)  
**ai_analysis_cache**: owner, system (all)  
**face_match_results**: admin (all) **[NEW]**  
**admin_audit_logs**: admin (all) **[NEW]**  
**admin_notes**: admin (all) **[NEW]**  
**account_flags**: admin (all), owner (read only) **[NEW]**  
**account_bans**: admin (all), owner (read only) **[NEW]**  
**payment_proofs**: admin (all), uploader (read only) **[NEW]**  
**withdrawal_execution_logs**: admin (all) **[NEW]**

---

## PART 7: Indexes

**Critical indexes for performance:**

- `profiles`: user_id (unique), email (unique), phone_number (unique), role+is_active
- `providers`: profile_id (unique), service_category+is_available, is_verified+rating, location
- `vendors`: profile_id (unique), city+area, is_verified+rating
- `job_requests`: customer_id, service_category+status, location+city, status+created_at
- `direct_job_requests`: customer_id, provider_id, status+created_at
- `jobs`: customer_id, provider_id, status+scheduled_date
- `payments`: payer_id, receiver_id, payment_status+payment_date
- `transactions`: wallet_id, user_id+created_at
- `notifications`: user_id+is_read+created_at, type+priority
- `message_threads`: participant_1_id+is_active, participant_2_id+is_active, last_message_at
- `messages`: thread_id+created_at, sender_id+created_at
- `reviews`: provider_id+is_verified, vendor_id+is_verified, rating+created_at
- `favorites`: customer_id, provider_id, vendor_id, created_at
- `documents`: uploaded_by, provider_id, vendor_id, category, created_at
- `service_pricing_packages`: provider_id, is_active, package_type, sort_order
- `withdrawals`: provider_id+status, vendor_id+status, status+created_at
- `featured_ads`: provider_id+is_active, vendor_id+is_active, is_active+start_date+end_date
- `face_match_results`: verification_id (unique) **[NEW]**
- `admin_audit_logs`: admin_user_id+created_at, target_entity_type+target_entity_id **[NEW]**
- `admin_notes`: target_profile_id, target_complaint_id, target_verification_id **[NEW]**
- `account_flags`: profile_id+is_active, flag_type **[NEW]**
- `account_bans`: profile_id+is_active **[NEW]**
- `payment_proofs`: subscription_id, featured_ad_id, is_verified **[NEW]**
- `withdrawal_execution_logs`: withdrawal_id (unique), executed_by+created_at **[NEW]**

---

## PART 8: Complete Table List

**Supabase Auth:** auth.users

**Custom Tables (39 total):**
1. profiles (10K-100K rows)
2. customers (7K-70K rows)
3. providers (2K-20K rows)
4. vendors (1K-10K rows)
5. admin_users (10-50 rows)
6. service_categories (20-50 rows)
7. job_requests (50K-500K rows)
8. direct_job_requests (20K-200K rows) - Customer to provider direct requests
9. jobs (30K-300K rows)
10. payments (100K-1M rows)
11. transactions (200K-2M rows)
12. wallets (2K-20K rows) - Provider and Vendor
13. withdrawals (10K-100K rows) - Provider and Vendor
14. subscriptions (5K-50K rows) - Customer, Provider, Vendor
15. featured_ads (5K-50K rows)
16. notifications (1M-10M rows)
17. message_threads (50K-500K rows)
18. messages (1M-10M rows)
19. reviews (50K-500K rows)
20. favorites (50K-500K rows) - Customer favorite providers/vendors
21. documents (100K-1M rows) - Uploaded file metadata
22. verifications (5K-50K rows)
23. verification_logs (10K-100K rows)
24. otp_verifications (100K-1M rows)
25. service_pricing_packages (10K-100K rows) - Provider pricing packages
26. complaints (5K-50K rows)
27. complaint_actions (10K-100K rows)
28. emergency_contacts (5K-50K rows)
29. emergency_alerts (1K-10K rows)
30. audit_logs (1M-10M rows)
31. system_settings (50-100 rows)
32. ai_analysis_cache (50K-500K rows)
33. face_match_results (5K-50K rows) **[NEW - ADMIN SPECIFIC]**
34. admin_audit_logs (100K-1M rows) **[NEW - ADMIN SPECIFIC]**
35. admin_notes (50K-500K rows) **[NEW - ADMIN SPECIFIC]**
36. account_flags (5K-50K rows) **[NEW - ADMIN SPECIFIC]**
37. account_bans (1K-10K rows) **[NEW - ADMIN SPECIFIC]**
38. payment_proofs (10K-100K rows) **[NEW - ADMIN SPECIFIC]**
39. withdrawal_execution_logs (10K-100K rows) **[NEW - ADMIN SPECIFIC]**

---

## PART 9: ROW LEVEL SECURITY POLICIES

### Admin Helper Function
```sql
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users au
    JOIN public.profiles p ON au.profile_id = p.id
    WHERE p.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### profiles RLS
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON profiles FOR SELECT
TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Admins can read all profiles" ON profiles FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE
TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### customers RLS
```sql
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can read own data" ON customers FOR SELECT
TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can read all customers" ON customers FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Customers can update own data" ON customers FOR UPDATE
TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update all customers" ON customers FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### providers RLS
```sql
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can read own data" ON providers FOR SELECT
TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can read all providers" ON providers FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Public can read verified providers" ON providers FOR SELECT
TO anon USING (is_verified = true);

CREATE POLICY "Providers can update own data" ON providers FOR UPDATE
TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update all providers" ON providers FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### vendors RLS
```sql
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can read own data" ON vendors FOR SELECT
TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can read all vendors" ON vendors FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Public can read verified vendors" ON vendors FOR SELECT
TO anon USING (is_verified = true);

CREATE POLICY "Vendors can update own data" ON vendors FOR UPDATE
TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update all vendors" ON vendors FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### admin_users RLS
```sql
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read admin_users" ON admin_users FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Only admins can update admin_users" ON admin_users FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### service_categories RLS
```sql
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read categories" ON service_categories FOR SELECT
TO authenticated USING (true);

CREATE POLICY "Public can read active categories" ON service_categories FOR SELECT
TO anon USING (is_active = true);

CREATE POLICY "Admins can update categories" ON service_categories FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### job_requests RLS
```sql
ALTER TABLE job_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can read own requests" ON job_requests FOR SELECT
TO authenticated USING (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all requests" ON job_requests FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Customers can create requests" ON job_requests FOR INSERT
TO authenticated WITH CHECK (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Customers can update own requests" ON job_requests FOR UPDATE
TO authenticated USING (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())))
WITH CHECK (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can update all requests" ON job_requests FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### direct_job_requests RLS
```sql
ALTER TABLE direct_job_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can read own direct requests" ON direct_job_requests FOR SELECT
TO authenticated USING (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Providers can read own direct requests" ON direct_job_requests FOR SELECT
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all direct requests" ON direct_job_requests FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Customers can create direct requests" ON direct_job_requests FOR INSERT
TO authenticated WITH CHECK (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Customers can update own direct requests" ON direct_job_requests FOR UPDATE
TO authenticated USING (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())))
WITH CHECK (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Providers can update own direct requests" ON direct_job_requests FOR UPDATE
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())))
WITH CHECK (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can update all direct requests" ON direct_job_requests FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### jobs RLS
```sql
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can read own jobs" ON jobs FOR SELECT
TO authenticated USING (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Providers can read own jobs" ON jobs FOR SELECT
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all jobs" ON jobs FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Customers can update own jobs" ON jobs FOR UPDATE
TO authenticated USING (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())))
WITH CHECK (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Providers can update own jobs" ON jobs FOR UPDATE
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())))
WITH CHECK (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can update all jobs" ON jobs FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### payments RLS
```sql
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Payers can read own payments" ON payments FOR SELECT
TO authenticated USING (payer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Receivers can read own payments" ON payments FOR SELECT
TO authenticated USING (receiver_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can read all payments" ON payments FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Admins can update all payments" ON payments FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### transactions RLS
```sql
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own transactions" ON transactions FOR SELECT
TO authenticated USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can read all transactions" ON transactions FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Admins can insert transactions" ON transactions FOR INSERT
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### wallets RLS
```sql
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can read own wallet" ON wallets FOR SELECT
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Vendors can read own wallet" ON wallets FOR SELECT
TO authenticated USING (vendor_id IN (SELECT id FROM vendors WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all wallets" ON wallets FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Admins can update all wallets" ON wallets FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### withdrawals RLS
```sql
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can read own withdrawals" ON withdrawals FOR SELECT
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Vendors can read own withdrawals" ON withdrawals FOR SELECT
TO authenticated USING (vendor_id IN (SELECT id FROM vendors WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all withdrawals" ON withdrawals FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Providers can create withdrawals" ON withdrawals FOR INSERT
TO authenticated WITH CHECK (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Vendors can create withdrawals" ON withdrawals FOR INSERT
TO authenticated WITH CHECK (vendor_id IN (SELECT id FROM vendors WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can update all withdrawals" ON withdrawals FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### subscriptions RLS
```sql
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can read own subscriptions" ON subscriptions FOR SELECT
TO authenticated USING (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Providers can read own subscriptions" ON subscriptions FOR SELECT
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Vendors can read own subscriptions" ON subscriptions FOR SELECT
TO authenticated USING (vendor_id IN (SELECT id FROM vendors WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all subscriptions" ON subscriptions FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Admins can update all subscriptions" ON subscriptions FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### featured_ads RLS
```sql
ALTER TABLE featured_ads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can read own ads" ON featured_ads FOR SELECT
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Vendors can read own ads" ON featured_ads FOR SELECT
TO authenticated USING (vendor_id IN (SELECT id FROM vendors WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all ads" ON featured_ads FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Public can read active ads" ON featured_ads FOR SELECT
TO anon USING (is_active = true);

CREATE POLICY "Providers can create ads" ON featured_ads FOR INSERT
TO authenticated WITH CHECK (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Vendors can create ads" ON featured_ads FOR INSERT
TO authenticated WITH CHECK (vendor_id IN (SELECT id FROM vendors WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can update all ads" ON featured_ads FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### notifications RLS
```sql
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications" ON notifications FOR SELECT
TO authenticated USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can read all notifications" ON notifications FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Admins can insert notifications" ON notifications FOR INSERT
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE
TO authenticated USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
WITH CHECK (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));
```

### message_threads RLS
```sql
ALTER TABLE message_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can read own threads" ON message_threads FOR SELECT
TO authenticated USING (participant_1_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR participant_2_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can read all threads" ON message_threads FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Participants can create threads" ON message_threads FOR INSERT
TO authenticated WITH CHECK (participant_1_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR participant_2_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Participants can update own threads" ON message_threads FOR UPDATE
TO authenticated USING (participant_1_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR participant_2_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())))
WITH CHECK (participant_1_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR participant_2_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update all threads" ON message_threads FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### messages RLS
```sql
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Thread participants can read messages" ON messages FOR SELECT
TO authenticated USING (thread_id IN (SELECT id FROM message_threads WHERE participant_1_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR participant_2_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all messages" ON messages FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Thread participants can create messages" ON messages FOR INSERT
TO authenticated WITH CHECK (sender_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) AND thread_id IN (SELECT id FROM message_threads WHERE participant_1_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR participant_2_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Thread participants can update own messages" ON messages FOR UPDATE
TO authenticated USING (sender_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
WITH CHECK (sender_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update all messages" ON messages FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### reviews RLS
```sql
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can read own reviews" ON reviews FOR SELECT
TO authenticated USING (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Providers can read own reviews" ON reviews FOR SELECT
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Vendors can read own reviews" ON reviews FOR SELECT
TO authenticated USING (vendor_id IN (SELECT id FROM vendors WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all reviews" ON reviews FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Public can read verified reviews" ON reviews FOR SELECT
TO anon USING (is_verified = true);

CREATE POLICY "Customers can create reviews" ON reviews FOR INSERT
TO authenticated WITH CHECK (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can update all reviews" ON reviews FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### favorites RLS
```sql
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can read own favorites" ON favorites FOR SELECT
TO authenticated USING (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all favorites" ON favorites FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Customers can create favorites" ON favorites FOR INSERT
TO authenticated WITH CHECK (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Customers can delete own favorites" ON favorites FOR DELETE
TO authenticated USING (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can update all favorites" ON favorites FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### verifications RLS
```sql
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can read own verifications" ON verifications FOR SELECT
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Vendors can read own verifications" ON verifications FOR SELECT
TO authenticated USING (vendor_id IN (SELECT id FROM vendors WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all verifications" ON verifications FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Providers can create verifications" ON verifications FOR INSERT
TO authenticated WITH CHECK (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Vendors can create verifications" ON verifications FOR INSERT
TO authenticated WITH CHECK (vendor_id IN (SELECT id FROM vendors WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can update all verifications" ON verifications FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### documents RLS
```sql
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own documents" ON documents FOR SELECT
TO authenticated USING (uploaded_by IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Providers can read own documents" ON documents FOR SELECT
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Vendors can read own documents" ON documents FOR SELECT
TO authenticated USING (vendor_id IN (SELECT id FROM vendors WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all documents" ON documents FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Users can create documents" ON documents FOR INSERT
TO authenticated WITH CHECK (uploaded_by IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own documents" ON documents FOR UPDATE
TO authenticated USING (uploaded_by IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
WITH CHECK (uploaded_by IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update all documents" ON documents FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### verification_logs RLS
```sql
ALTER TABLE verification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read all verification logs" ON verification_logs FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Admins can insert verification logs" ON verification_logs FOR INSERT
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### service_pricing_packages RLS
```sql
ALTER TABLE service_pricing_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can read own pricing packages" ON service_pricing_packages FOR SELECT
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all pricing packages" ON service_pricing_packages FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Public can read active pricing packages" ON service_pricing_packages FOR SELECT
TO anon USING (is_active = true);

CREATE POLICY "Providers can create pricing packages" ON service_pricing_packages FOR INSERT
TO authenticated WITH CHECK (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Providers can update own pricing packages" ON service_pricing_packages FOR UPDATE
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())))
WITH CHECK (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can update all pricing packages" ON service_pricing_packages FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### otp_verifications RLS
```sql
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own OTPs" ON otp_verifications FOR SELECT
TO authenticated USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can read all OTPs" ON otp_verifications FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "System can insert OTPs" ON otp_verifications FOR INSERT
TO authenticated
WITH CHECK (true);
```

### complaints RLS
```sql
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can read own complaints" ON complaints FOR SELECT
TO authenticated USING (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Providers can read own complaints" ON complaints FOR SELECT
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Vendors can read own complaints" ON complaints FOR SELECT
TO authenticated USING (vendor_id IN (SELECT id FROM vendors WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all complaints" ON complaints FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Customers can create complaints" ON complaints FOR INSERT
TO authenticated WITH CHECK (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can update all complaints" ON complaints FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### complaint_actions RLS
```sql
ALTER TABLE complaint_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read all complaint actions" ON complaint_actions FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Admins can insert complaint actions" ON complaint_actions FOR INSERT
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### emergency_contacts RLS
```sql
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can read own contacts" ON emergency_contacts FOR SELECT
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all contacts" ON emergency_contacts FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Providers can create contacts" ON emergency_contacts FOR INSERT
TO authenticated WITH CHECK (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Providers can update own contacts" ON emergency_contacts FOR UPDATE
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())))
WITH CHECK (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can update all contacts" ON emergency_contacts FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### emergency_alerts RLS
```sql
ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can read own alerts" ON emergency_alerts FOR SELECT
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all alerts" ON emergency_alerts FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Providers can create alerts" ON emergency_alerts FOR INSERT
TO authenticated WITH CHECK (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can update all alerts" ON emergency_alerts FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### audit_logs RLS
```sql
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read all audit logs" ON audit_logs FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "System can insert audit logs" ON audit_logs FOR INSERT
TO authenticated
WITH CHECK (true);
```

### system_settings RLS
```sql
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read all settings" ON system_settings FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Public can read non-sensitive settings" ON system_settings FOR SELECT
TO anon USING (key NOT IN ('payment_keys', 'api_secrets', 'admin_passwords'));

CREATE POLICY "Admins can update all settings" ON system_settings FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### ai_analysis_cache RLS
```sql
ALTER TABLE ai_analysis_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can read own cache" ON ai_analysis_cache FOR SELECT
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Vendors can read own cache" ON ai_analysis_cache FOR SELECT
TO authenticated USING (vendor_id IN (SELECT id FROM vendors WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Authenticated users can read all cache" ON ai_analysis_cache FOR SELECT
TO authenticated USING (true);

CREATE POLICY "System can insert cache" ON ai_analysis_cache FOR INSERT
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### face_match_results RLS **[NEW - ADMIN SPECIFIC]**
```sql
ALTER TABLE face_match_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read face match results" ON face_match_results FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Only admins can insert face match results" ON face_match_results FOR INSERT
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### admin_audit_logs RLS **[NEW - ADMIN SPECIFIC]**
```sql
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read admin audit logs" ON admin_audit_logs FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Only admins can insert admin audit logs" ON admin_audit_logs FOR INSERT
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### admin_notes RLS **[NEW - ADMIN SPECIFIC]**
```sql
ALTER TABLE admin_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read admin notes" ON admin_notes FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Only admins can create admin notes" ON admin_notes FOR INSERT
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Only admins can update admin notes" ON admin_notes FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### account_flags RLS **[NEW - ADMIN SPECIFIC]**
```sql
ALTER TABLE account_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read all account flags" ON account_flags FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Users can read own account flags" ON account_flags FOR SELECT
TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Only admins can create account flags" ON account_flags FOR INSERT
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Only admins can update account flags" ON account_flags FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### account_bans RLS **[NEW - ADMIN SPECIFIC]**
```sql
ALTER TABLE account_bans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read all account bans" ON account_bans FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Users can read own account bans" ON account_bans FOR SELECT
TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Only admins can create account bans" ON account_bans FOR INSERT
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Only admins can update account bans" ON account_bans FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### payment_proofs RLS **[NEW - ADMIN SPECIFIC]**
```sql
ALTER TABLE payment_proofs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read all payment proofs" ON payment_proofs FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Uploaders can read own payment proofs" ON payment_proofs FOR SELECT
TO authenticated USING (uploaded_by IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create payment proofs" ON payment_proofs FOR INSERT
TO authenticated WITH CHECK (uploaded_by IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Only admins can update payment proofs" ON payment_proofs FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### withdrawal_execution_logs RLS **[NEW - ADMIN SPECIFIC]**
```sql
ALTER TABLE withdrawal_execution_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read withdrawal execution logs" ON withdrawal_execution_logs FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Only admins can insert withdrawal execution logs" ON withdrawal_execution_logs FOR INSERT
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

---

## PART 10: COMPLETE SQL FOR SUPABASE

### =====================
### SECTION A: HELPER FUNCTIONS
### =====================

```sql
-- Admin Helper Function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users au
    JOIN public.profiles p ON au.profile_id = p.id
    WHERE p.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Provider Helper Function
CREATE OR REPLACE FUNCTION is_provider()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.providers pr
    JOIN public.profiles p ON pr.profile_id = p.id
    WHERE p.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Customer Helper Function
CREATE OR REPLACE FUNCTION is_customer()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.customers c
    JOIN public.profiles p ON c.profile_id = p.id
    WHERE p.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Vendor Helper Function
CREATE OR REPLACE FUNCTION is_vendor()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.vendors v
    JOIN public.profiles p ON v.profile_id = p.id
    WHERE p.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Supabase Auth Trigger Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, email, phone_number, role, is_active)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
          NEW.email, COALESCE(NEW.raw_user_meta_data->>'phone_number', ''),
          COALESCE(NEW.raw_user_meta_data->>'role', 'customer'), true);
  
  IF NEW.raw_user_meta_data->>'role' = 'customer' THEN
    INSERT INTO public.customers (profile_id) SELECT id FROM public.profiles WHERE user_id = NEW.id;
  ELSIF NEW.raw_user_meta_data->>'role' = 'provider' THEN
    INSERT INTO public.providers (profile_id, service_category)
    SELECT id, COALESCE(NEW.raw_user_meta_data->>'service_category', 'General')
    FROM public.profiles WHERE user_id = NEW.id;
  ELSIF NEW.raw_user_meta_data->>'role' = 'vendor' THEN
    INSERT INTO public.vendors (profile_id, business_name)
    SELECT id, COALESCE(NEW.raw_user_meta_data->>'business_name', 'Business')
    FROM public.profiles WHERE user_id = NEW.id;
  ELSIF NEW.raw_user_meta_data->>'role' = 'admin' THEN
    INSERT INTO public.admin_users (profile_id, admin_level)
    SELECT id, 'admin' FROM public.profiles WHERE user_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### =====================
### SECTION B: CREATE TABLE
### =====================

```sql
-- profiles
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  profile_image_url TEXT,
  location TEXT,
  address TEXT,
  city TEXT,
  area TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  language TEXT DEFAULT 'English',
  role TEXT NOT NULL CHECK (role IN ('customer','provider','vendor','admin')),
  is_active BOOLEAN DEFAULT true,
  is_suspended BOOLEAN DEFAULT false,
  suspension_reason TEXT,
  suspension_until TIMESTAMP,
  device_token TEXT,
  last_seen_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- customers
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE NOT NULL REFERENCES profiles(id),
  preferences JSONB DEFAULT '{}',
  notification_settings JSONB DEFAULT '{}',
  language TEXT DEFAULT 'English' CHECK (language IN ('English', 'Urdu', 'Bilingual')),
  is_pro BOOLEAN DEFAULT false,
  pro_expiry_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- providers
CREATE TABLE providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE NOT NULL REFERENCES profiles(id),
  service_category TEXT NOT NULL,
  tagline TEXT,
  experience_years INTEGER DEFAULT 0,
  hourly_rate DECIMAL(10,2),
  location TEXT,
  address TEXT,
  city TEXT,
  area TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  language TEXT DEFAULT 'English' CHECK (language IN ('English', 'Urdu', 'Bilingual')),
  is_available BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  cnic_number TEXT,
  cnic_expiry_date DATE,
  rating DECIMAL(3,2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,
  completed_jobs INTEGER DEFAULT 0,
  is_pro BOOLEAN DEFAULT false,
  pro_expiry_date TIMESTAMP,
  warning_count INTEGER DEFAULT 0,
  flag_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- vendors
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE NOT NULL REFERENCES profiles(id),
  business_name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  years_in_business INTEGER DEFAULT 0,
  location TEXT,
  address TEXT,
  city TEXT,
  area TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  language TEXT DEFAULT 'English' CHECK (language IN ('English', 'Urdu', 'Bilingual')),
  is_verified BOOLEAN DEFAULT false,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  cnic_number TEXT,
  cnic_expiry_date DATE,
  rating DECIMAL(3,2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
  review_count INTEGER DEFAULT 0,
  is_pro BOOLEAN DEFAULT false,
  pro_expiry_date TIMESTAMP,
  warning_count INTEGER DEFAULT 0,
  flag_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- admin_users
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID UNIQUE NOT NULL REFERENCES profiles(id),
  admin_level TEXT NOT NULL CHECK (admin_level IN ('super_admin','admin','moderator')),
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- service_categories
CREATE TABLE service_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  name_urdu TEXT,
  icon TEXT,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- wallets
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id),
  vendor_id UUID REFERENCES vendors(id),
  balance DECIMAL(10,2) DEFAULT 0.00 CHECK (balance >= 0),
  total_earnings DECIMAL(10,2) DEFAULT 0.00,
  currency TEXT DEFAULT 'PKR',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT wallet_owner_check CHECK (
    (provider_id IS NOT NULL AND vendor_id IS NULL) OR
    (provider_id IS NULL AND vendor_id IS NOT NULL)
  )
);

-- subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  provider_id UUID REFERENCES providers(id),
  vendor_id UUID REFERENCES vendors(id),
  plan_name TEXT NOT NULL,
  plan_price DECIMAL(10,2) NOT NULL,
  plan_period TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  auto_renew BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- featured_ads
CREATE TABLE featured_ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id),
  vendor_id UUID REFERENCES vendors(id),
  ad_type TEXT NOT NULL,
  tagline TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  plan_type TEXT,
  plan_price DECIMAL(10,2),
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  user_type TEXT CHECK (user_type IN ('provider','vendor')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- job_requests
CREATE TABLE job_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  service_category TEXT NOT NULL REFERENCES service_categories(name),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT,
  area TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  budget DECIMAL(10,2),
  is_urgent BOOLEAN DEFAULT false,
  scheduled_date DATE,
  scheduled_time TIME,
  status TEXT DEFAULT 'open' CHECK (status IN ('open','in_progress','completed','cancelled')),
  accepted_by UUID REFERENCES providers(id),
  accepted_at TIMESTAMP,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- direct_job_requests
CREATE TABLE direct_job_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  provider_id UUID NOT NULL REFERENCES providers(id),
  service_category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT,
  area TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  package_type TEXT,
  proposed_price DECIMAL(10,2),
  special_instructions TEXT,
  negotiation_notes TEXT,
  scheduled_date DATE,
  scheduled_time TIME,
  duration_type TEXT,
  is_priority_response BOOLEAN DEFAULT false,
  is_nda_required BOOLEAN DEFAULT false,
  custom_budget_min DECIMAL(10,2),
  custom_budget_max DECIMAL(10,2),
  customer_is_pro BOOLEAN DEFAULT false,
  platform_fee_percentage DECIMAL(5,2) DEFAULT 10.0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','accepted','rejected','negotiating','cancelled')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- jobs
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_request_id UUID REFERENCES job_requests(id),
  direct_request_id UUID REFERENCES direct_job_requests(id),
  customer_id UUID NOT NULL REFERENCES customers(id),
  provider_id UUID NOT NULL REFERENCES providers(id),
  service_category TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT,
  area TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  scheduled_date DATE,
  scheduled_time TIME,
  status TEXT NOT NULL CHECK (status IN ('active','scheduled','completed','cancelled')),
  completion_date DATE,
  completion_time TIME,
  rating DECIMAL(3,2),
  review TEXT,
  cancel_date DATE,
  cancel_reason TEXT,
  cancel_description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- verifications
CREATE TABLE verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id),
  vendor_id UUID REFERENCES vendors(id),
  document_type TEXT NOT NULL,
  document_url TEXT NOT NULL,
  cnic_url TEXT,
  selfie_url TEXT,
  status TEXT DEFAULT 'pending',
  rejection_reason TEXT,
  verified_by UUID REFERENCES admin_users(id),
  verified_at TIMESTAMP,
  expiry_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  provider_id UUID REFERENCES providers(id),
  vendor_id UUID REFERENCES vendors(id),
  verification_id UUID REFERENCES verifications(id),
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size INTEGER,
  file_url TEXT NOT NULL,
  storage_path TEXT,
  mime_type TEXT,
  category TEXT,
  description TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- payments
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id),
  direct_request_id UUID REFERENCES direct_job_requests(id),
  subscription_id UUID REFERENCES subscriptions(id),
  featured_ad_id UUID REFERENCES featured_ads(id),
  payer_id UUID NOT NULL REFERENCES profiles(id),
  receiver_id UUID REFERENCES profiles(id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'PKR',
  payment_method TEXT NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  transaction_id TEXT UNIQUE,
  payment_date TIMESTAMP,
  escrow_status TEXT DEFAULT 'pending' CHECK (escrow_status IN ('pending','held','released','refunded')),
  released_at TIMESTAMP,
  refunded_at TIMESTAMP,
  refund_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT payment_type_check CHECK (
    (job_id IS NOT NULL AND subscription_id IS NULL AND featured_ad_id IS NULL) OR
    (job_id IS NULL AND subscription_id IS NOT NULL AND featured_ad_id IS NULL) OR
    (job_id IS NULL AND subscription_id IS NULL AND featured_ad_id IS NOT NULL)
  )
);

-- withdrawals
CREATE TABLE withdrawals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID NOT NULL REFERENCES wallets(id),
  provider_id UUID REFERENCES providers(id),
  vendor_id UUID REFERENCES vendors(id),
  amount DECIMAL(10,2) NOT NULL,
  withdrawal_method TEXT NOT NULL,
  account_details JSONB NOT NULL,
  status TEXT DEFAULT 'pending',
  rejection_reason TEXT,
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id UUID REFERENCES wallets(id),
  withdrawal_id UUID REFERENCES withdrawals(id),
  payment_id UUID REFERENCES payments(id),
  user_id UUID NOT NULL REFERENCES profiles(id),
  type TEXT NOT NULL CHECK (type IN ('credit','debit')),
  amount DECIMAL(10,2) NOT NULL,
  balance_after DECIMAL(10,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- notifications
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  category TEXT,
  is_read BOOLEAN DEFAULT false,
  action_type TEXT,
  action_data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- message_threads
CREATE TABLE message_threads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_1_id UUID NOT NULL REFERENCES profiles(id),
  participant_2_id UUID NOT NULL REFERENCES profiles(id),
  job_id UUID REFERENCES jobs(id),
  last_message_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES message_threads(id),
  sender_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  is_voice_message BOOLEAN DEFAULT false,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  provider_id UUID REFERENCES providers(id),
  vendor_id UUID REFERENCES vendors(id),
  job_id UUID REFERENCES jobs(id),
  rating DECIMAL(3,2) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  review TEXT,
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- favorites
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  provider_id UUID REFERENCES providers(id),
  vendor_id UUID REFERENCES vendors(id),
  UNIQUE(customer_id, provider_id),
  UNIQUE(customer_id, vendor_id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- service_pricing_packages
CREATE TABLE service_pricing_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id),
  package_name TEXT NOT NULL,
  package_type TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'PKR',
  duration TEXT,
  includes JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- verification_logs
CREATE TABLE verification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_id UUID NOT NULL REFERENCES verifications(id),
  old_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES admin_users(id),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- otp_verifications
CREATE TABLE otp_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  phone_number TEXT NOT NULL,
  otp_code TEXT NOT NULL,
  purpose TEXT NOT NULL,
  is_used BOOLEAN DEFAULT false,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- complaints
CREATE TABLE complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id),
  provider_id UUID REFERENCES providers(id),
  vendor_id UUID REFERENCES vendors(id),
  job_id UUID REFERENCES jobs(id),
  complaint_type TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  priority TEXT DEFAULT 'medium',
  assigned_to UUID REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- complaint_actions
CREATE TABLE complaint_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID NOT NULL REFERENCES complaints(id),
  action_type TEXT NOT NULL,
  description TEXT,
  taken_by UUID NOT NULL REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- emergency_contacts
CREATE TABLE emergency_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id),
  name TEXT NOT NULL,
  relationship TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- emergency_alerts
CREATE TABLE emergency_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID NOT NULL REFERENCES providers(id),
  job_id UUID REFERENCES jobs(id),
  location TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  message TEXT,
  status TEXT DEFAULT 'active',
  resolved_by UUID REFERENCES admin_users(id),
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- audit_logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- system_settings
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by UUID REFERENCES admin_users(id)
);

-- ai_analysis_cache
CREATE TABLE ai_analysis_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id),
  vendor_id UUID REFERENCES vendors(id),
  analysis_type TEXT NOT NULL,
  input_data JSONB NOT NULL,
  result JSONB NOT NULL,
  confidence_score DECIMAL(5,4),
  cache_key TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- face_match_results (ADMIN SPECIFIC)
CREATE TABLE face_match_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_id UUID UNIQUE NOT NULL REFERENCES verifications(id),
  decision TEXT NOT NULL CHECK (decision IN ('MATCH','NO_MATCH','POSSIBLE_MATCH')),
  recommendation TEXT NOT NULL CHECK (recommendation IN ('APPROVE','REJECT','MANUAL_REVIEW')),
  confidence_score DECIMAL(5,4) NOT NULL,
  confidence_percentage TEXT,
  distance DECIMAL(10,6),
  is_match BOOLEAN,
  threshold_used DECIMAL(10,6),
  model_used TEXT,
  processing_time_ms INTEGER,
  cnic_face_detected BOOLEAN,
  selfie_face_detected BOOLEAN,
  cnic_face_confidence DECIMAL(5,4),
  selfie_face_confidence DECIMAL(5,4),
  cnic_face_location JSONB,
  image_quality JSONB,
  cnic_url TEXT,
  selfie_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- admin_audit_logs (ADMIN SPECIFIC)
CREATE TABLE admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES admin_users(id),
  action_type TEXT NOT NULL,
  target_entity_type TEXT NOT NULL,
  target_entity_id UUID,
  action_details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- admin_notes (ADMIN SPECIFIC)
CREATE TABLE admin_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES admin_users(id),
  target_profile_id UUID REFERENCES profiles(id),
  target_complaint_id UUID REFERENCES complaints(id),
  target_verification_id UUID REFERENCES verifications(id),
  note TEXT NOT NULL,
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- account_flags (ADMIN SPECIFIC)
CREATE TABLE account_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id),
  flagged_by UUID NOT NULL REFERENCES admin_users(id),
  flag_reason TEXT NOT NULL,
  flag_type TEXT NOT NULL CHECK (flag_type IN ('warning','monitor','investigation')),
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- account_bans (ADMIN SPECIFIC)
CREATE TABLE account_bans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id),
  banned_by UUID NOT NULL REFERENCES admin_users(id),
  ban_reason TEXT NOT NULL,
  ban_duration TEXT NOT NULL CHECK (ban_duration IN ('7days','30days','permanent')),
  permanent_confirmed BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- payment_proofs (ADMIN SPECIFIC)
CREATE TABLE payment_proofs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES subscriptions(id),
  featured_ad_id UUID REFERENCES featured_ads(id),
  proof_image_url TEXT NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES profiles(id),
  verified_by UUID REFERENCES admin_users(id),
  is_verified BOOLEAN DEFAULT false,
  verification_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- withdrawal_execution_logs (ADMIN SPECIFIC)
CREATE TABLE withdrawal_execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  withdrawal_id UUID UNIQUE NOT NULL REFERENCES withdrawals(id),
  executed_by UUID NOT NULL REFERENCES admin_users(id),
  payout_method TEXT NOT NULL,
  bank_name TEXT,
  account_number TEXT,
  account_title TEXT,
  mobile_number TEXT,
  wallet_type TEXT,
  payout_amount DECIMAL(10,2) NOT NULL,
  fee_amount DECIMAL(10,2) NOT NULL,
  net_payout DECIMAL(10,2) NOT NULL,
  transaction_reference TEXT,
  execution_status TEXT NOT NULL CHECK (execution_status IN ('success','failed')),
  failure_reason TEXT,
  payment_proof_url TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### =====================
### SECTION C: CREATE INDEX
### =====================

```sql
-- profiles indexes
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE UNIQUE INDEX idx_profiles_email ON profiles(email);
CREATE UNIQUE INDEX idx_profiles_phone_number ON profiles(phone_number);
CREATE INDEX idx_profiles_role_is_active ON profiles(role, is_active);

-- providers indexes
CREATE UNIQUE INDEX idx_providers_profile_id ON providers(profile_id);
CREATE INDEX idx_providers_service_category_is_available ON providers(service_category, is_available);
CREATE INDEX idx_providers_is_verified_rating ON providers(is_verified, rating);
CREATE INDEX idx_providers_location ON providers(location);

-- vendors indexes
CREATE UNIQUE INDEX idx_vendors_profile_id ON vendors(profile_id);
CREATE INDEX idx_vendors_city_area ON vendors(city, area);
CREATE INDEX idx_vendors_is_verified_rating ON vendors(is_verified, rating);

-- job_requests indexes
CREATE INDEX idx_job_requests_customer_id ON job_requests(customer_id);
CREATE INDEX idx_job_requests_service_category_status ON job_requests(service_category, status);
CREATE INDEX idx_job_requests_location_city ON job_requests(location, city);
CREATE INDEX idx_job_requests_status_created_at ON job_requests(status, created_at);

-- direct_job_requests indexes
CREATE INDEX idx_direct_job_requests_customer_id ON direct_job_requests(customer_id);
CREATE INDEX idx_direct_job_requests_provider_id ON direct_job_requests(provider_id);
CREATE INDEX idx_direct_job_requests_status_created_at ON direct_job_requests(status, created_at);

-- jobs indexes
CREATE INDEX idx_jobs_customer_id ON jobs(customer_id);
CREATE INDEX idx_jobs_provider_id ON jobs(provider_id);
CREATE INDEX idx_jobs_status_scheduled_date ON jobs(status, scheduled_date);

-- payments indexes
CREATE INDEX idx_payments_payer_id ON payments(payer_id);
CREATE INDEX idx_payments_receiver_id ON payments(receiver_id);
CREATE INDEX idx_payments_payment_status_payment_date ON payments(payment_status, payment_date);

-- transactions indexes
CREATE INDEX idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX idx_transactions_user_id_created_at ON transactions(user_id, created_at);

-- notifications indexes
CREATE INDEX idx_notifications_user_id_is_read_created_at ON notifications(user_id, is_read, created_at);
CREATE INDEX idx_notifications_type_priority ON notifications(type, priority);

-- message_threads indexes
CREATE INDEX idx_message_threads_participant_1_id_is_active ON message_threads(participant_1_id, is_active);
CREATE INDEX idx_message_threads_participant_2_id_is_active ON message_threads(participant_2_id, is_active);
CREATE INDEX idx_message_threads_last_message_at ON message_threads(last_message_at);

-- messages indexes
CREATE INDEX idx_messages_thread_time ON messages(thread_id, created_at DESC);
CREATE INDEX idx_messages_sender_id_created_at ON messages(sender_id, created_at);

-- reviews indexes
CREATE INDEX idx_reviews_provider_id_is_verified ON reviews(provider_id, is_verified);
CREATE INDEX idx_reviews_vendor_id_is_verified ON reviews(vendor_id, is_verified);
CREATE INDEX idx_reviews_rating_created_at ON reviews(rating, created_at);

-- favorites indexes
CREATE INDEX idx_favorites_customer_id ON favorites(customer_id);
CREATE INDEX idx_favorites_provider_id ON favorites(provider_id);
CREATE INDEX idx_favorites_vendor_id ON favorites(vendor_id);
CREATE INDEX idx_favorites_created_at ON favorites(created_at);

-- documents indexes
CREATE INDEX idx_documents_uploaded_by ON documents(uploaded_by);
CREATE INDEX idx_documents_provider_id ON documents(provider_id);
CREATE INDEX idx_documents_vendor_id ON documents(vendor_id);
CREATE INDEX idx_documents_category ON documents(category);
CREATE INDEX idx_documents_created_at ON documents(created_at);

-- service_pricing_packages indexes
CREATE INDEX idx_service_pricing_packages_provider_id ON service_pricing_packages(provider_id);
CREATE INDEX idx_service_pricing_packages_is_active ON service_pricing_packages(is_active);
CREATE INDEX idx_service_pricing_packages_package_type ON service_pricing_packages(package_type);
CREATE INDEX idx_service_pricing_packages_sort_order ON service_pricing_packages(sort_order);

-- withdrawals indexes
CREATE INDEX idx_withdrawals_provider_id_status ON withdrawals(provider_id, status);
CREATE INDEX idx_withdrawals_vendor_id_status ON withdrawals(vendor_id, status);
CREATE INDEX idx_withdrawals_status_created_at ON withdrawals(status, created_at);

-- featured_ads indexes
CREATE INDEX idx_featured_ads_provider_id_is_active ON featured_ads(provider_id, is_active);
CREATE INDEX idx_featured_ads_vendor_id_is_active ON featured_ads(vendor_id, is_active);
CREATE INDEX idx_featured_ads_is_active_start_date_end_date ON featured_ads(is_active, start_date, end_date);

-- location indexes
CREATE INDEX idx_providers_lat_lng ON providers(latitude, longitude);
CREATE INDEX idx_vendors_lat_lng ON vendors(latitude, longitude);
CREATE INDEX idx_jobs_lat_lng ON jobs(latitude, longitude);

-- face_match_results indexes (ADMIN SPECIFIC)
CREATE UNIQUE INDEX idx_face_match_results_verification_id ON face_match_results(verification_id);

-- admin_audit_logs indexes (ADMIN SPECIFIC)
CREATE INDEX idx_admin_audit_logs_admin_user_id_created_at ON admin_audit_logs(admin_user_id, created_at);
CREATE INDEX idx_admin_audit_logs_target_entity_type_target_entity_id ON admin_audit_logs(target_entity_type, target_entity_id);

-- admin_notes indexes (ADMIN SPECIFIC)
CREATE INDEX idx_admin_notes_target_profile_id ON admin_notes(target_profile_id);
CREATE INDEX idx_admin_notes_target_complaint_id ON admin_notes(target_complaint_id);
CREATE INDEX idx_admin_notes_target_verification_id ON admin_notes(target_verification_id);

-- account_flags indexes (ADMIN SPECIFIC)
CREATE INDEX idx_account_flags_profile_id_is_active ON account_flags(profile_id, is_active);
CREATE INDEX idx_account_flags_flag_type ON account_flags(flag_type);

-- account_bans indexes (ADMIN SPECIFIC)
CREATE INDEX idx_account_bans_profile_id_is_active ON account_bans(profile_id, is_active);

-- payment_proofs indexes (ADMIN SPECIFIC)
CREATE INDEX idx_payment_proofs_subscription_id ON payment_proofs(subscription_id);
CREATE INDEX idx_payment_proofs_featured_ad_id ON payment_proofs(featured_ad_id);
CREATE INDEX idx_payment_proofs_is_verified ON payment_proofs(is_verified);

-- withdrawal_execution_logs indexes (ADMIN SPECIFIC)
CREATE UNIQUE INDEX idx_withdrawal_execution_logs_withdrawal_id ON withdrawal_execution_logs(withdrawal_id);
CREATE INDEX idx_withdrawal_execution_logs_executed_by_created_at ON withdrawal_execution_logs(executed_by, created_at);
```

### =====================
### SECTION D: RLS POLICIES
### =====================

```sql
-- profiles RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON profiles FOR SELECT
TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Admins can read all profiles" ON profiles FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT
TO authenticated WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE
TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can update all profiles" ON profiles FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- customers RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can read own data" ON customers FOR SELECT
TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can read all customers" ON customers FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "System can insert customers" ON customers FOR INSERT
TO authenticated WITH CHECK (true);

CREATE POLICY "Customers can update own data" ON customers FOR UPDATE
TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update all customers" ON customers FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- providers RLS
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can read own data" ON providers FOR SELECT
TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can read all providers" ON providers FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Public can read verified providers" ON providers FOR SELECT
TO anon USING (is_verified = true);

CREATE POLICY "System can insert providers" ON providers FOR INSERT
TO authenticated WITH CHECK (true);

CREATE POLICY "Providers can update own data" ON providers FOR UPDATE
TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update all providers" ON providers FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- vendors RLS
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Vendors can read own data" ON vendors FOR SELECT
TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can read all vendors" ON vendors FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Public can read verified vendors" ON vendors FOR SELECT
TO anon USING (is_verified = true);

CREATE POLICY "System can insert vendors" ON vendors FOR INSERT
TO authenticated WITH CHECK (true);

CREATE POLICY "Vendors can update own data" ON vendors FOR UPDATE
TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
WITH CHECK (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update all vendors" ON vendors FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- admin_users RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read admin_users" ON admin_users FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Only admins can update admin_users" ON admin_users FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- service_categories RLS
ALTER TABLE service_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can read categories" ON service_categories FOR SELECT
TO authenticated USING (true);

CREATE POLICY "Public can read active categories" ON service_categories FOR SELECT
TO anon USING (is_active = true);

CREATE POLICY "Admins can update categories" ON service_categories FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- job_requests RLS
ALTER TABLE job_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can read own requests" ON job_requests FOR SELECT
TO authenticated USING (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all requests" ON job_requests FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Customers can create requests" ON job_requests FOR INSERT
TO authenticated WITH CHECK (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Customers can update own requests" ON job_requests FOR UPDATE
TO authenticated USING (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())))
WITH CHECK (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can update all requests" ON job_requests FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- direct_job_requests RLS
ALTER TABLE direct_job_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can read own direct requests" ON direct_job_requests FOR SELECT
TO authenticated USING (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Providers can read own direct requests" ON direct_job_requests FOR SELECT
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all direct requests" ON direct_job_requests FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Customers can create direct requests" ON direct_job_requests FOR INSERT
TO authenticated WITH CHECK (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Customers can update own direct requests" ON direct_job_requests FOR UPDATE
TO authenticated USING (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())))
WITH CHECK (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Providers can update own direct requests" ON direct_job_requests FOR UPDATE
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())))
WITH CHECK (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can update all direct requests" ON direct_job_requests FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- jobs RLS
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can read own jobs" ON jobs FOR SELECT
TO authenticated USING (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Providers can read own jobs" ON jobs FOR SELECT
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all jobs" ON jobs FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Customers can update own jobs" ON jobs FOR UPDATE
TO authenticated USING (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())))
WITH CHECK (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Providers can update own jobs" ON jobs FOR UPDATE
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())))
WITH CHECK (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can update all jobs" ON jobs FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- payments RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Payers can read own payments" ON payments FOR SELECT
TO authenticated USING (payer_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Receivers can read own payments" ON payments FOR SELECT
TO authenticated USING (receiver_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can read all payments" ON payments FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Admins can update all payments" ON payments FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- transactions RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own transactions" ON transactions FOR SELECT
TO authenticated USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can read all transactions" ON transactions FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Admins can insert transactions" ON transactions FOR INSERT
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- wallets RLS
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can read own wallet" ON wallets FOR SELECT
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Vendors can read own wallet" ON wallets FOR SELECT
TO authenticated USING (vendor_id IN (SELECT id FROM vendors WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all wallets" ON wallets FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Admins can update all wallets" ON wallets FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- withdrawals RLS
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can read own withdrawals" ON withdrawals FOR SELECT
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Vendors can read own withdrawals" ON withdrawals FOR SELECT
TO authenticated USING (vendor_id IN (SELECT id FROM vendors WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all withdrawals" ON withdrawals FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Providers can create withdrawals" ON withdrawals FOR INSERT
TO authenticated WITH CHECK (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Vendors can create withdrawals" ON withdrawals FOR INSERT
TO authenticated WITH CHECK (vendor_id IN (SELECT id FROM vendors WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can update all withdrawals" ON withdrawals FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- subscriptions RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can read own subscriptions" ON subscriptions FOR SELECT
TO authenticated USING (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Providers can read own subscriptions" ON subscriptions FOR SELECT
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Vendors can read own subscriptions" ON subscriptions FOR SELECT
TO authenticated USING (vendor_id IN (SELECT id FROM vendors WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all subscriptions" ON subscriptions FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Admins can update all subscriptions" ON subscriptions FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- featured_ads RLS
ALTER TABLE featured_ads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can read own ads" ON featured_ads FOR SELECT
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Vendors can read own ads" ON featured_ads FOR SELECT
TO authenticated USING (vendor_id IN (SELECT id FROM vendors WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all ads" ON featured_ads FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Public can read active ads" ON featured_ads FOR SELECT
TO anon USING (is_active = true);

CREATE POLICY "Providers can create ads" ON featured_ads FOR INSERT
TO authenticated WITH CHECK (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Vendors can create ads" ON featured_ads FOR INSERT
TO authenticated WITH CHECK (vendor_id IN (SELECT id FROM vendors WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can update all ads" ON featured_ads FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- notifications RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own notifications" ON notifications FOR SELECT
TO authenticated USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can read all notifications" ON notifications FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Admins can insert notifications" ON notifications FOR INSERT
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE
TO authenticated USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
WITH CHECK (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

-- message_threads RLS
ALTER TABLE message_threads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants can read own threads" ON message_threads FOR SELECT
TO authenticated USING (participant_1_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR participant_2_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can read all threads" ON message_threads FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Participants can create threads" ON message_threads FOR INSERT
TO authenticated WITH CHECK (participant_1_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR participant_2_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Participants can update own threads" ON message_threads FOR UPDATE
TO authenticated USING (participant_1_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR participant_2_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())))
WITH CHECK (participant_1_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR participant_2_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update all threads" ON message_threads FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- messages RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Thread participants can read messages" ON messages FOR SELECT
TO authenticated USING (thread_id IN (SELECT id FROM message_threads WHERE participant_1_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR participant_2_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all messages" ON messages FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Thread participants can create messages" ON messages FOR INSERT
TO authenticated WITH CHECK (sender_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) AND thread_id IN (SELECT id FROM message_threads WHERE participant_1_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()) OR participant_2_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Thread participants can update own messages" ON messages FOR UPDATE
TO authenticated USING (sender_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
WITH CHECK (sender_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update all messages" ON messages FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- reviews RLS
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can read own reviews" ON reviews FOR SELECT
TO authenticated USING (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Providers can read own reviews" ON reviews FOR SELECT
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Vendors can read own reviews" ON reviews FOR SELECT
TO authenticated USING (vendor_id IN (SELECT id FROM vendors WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all reviews" ON reviews FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Public can read verified reviews" ON reviews FOR SELECT
TO anon USING (is_verified = true);

CREATE POLICY "Customers can create reviews" ON reviews FOR INSERT
TO authenticated WITH CHECK (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can update all reviews" ON reviews FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- favorites RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can read own favorites" ON favorites FOR SELECT
TO authenticated USING (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all favorites" ON favorites FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Customers can create favorites" ON favorites FOR INSERT
TO authenticated WITH CHECK (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Customers can delete own favorites" ON favorites FOR DELETE
TO authenticated USING (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can update all favorites" ON favorites FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- verifications RLS
ALTER TABLE verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can read own verifications" ON verifications FOR SELECT
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Vendors can read own verifications" ON verifications FOR SELECT
TO authenticated USING (vendor_id IN (SELECT id FROM vendors WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all verifications" ON verifications FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Providers can create verifications" ON verifications FOR INSERT
TO authenticated WITH CHECK (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Vendors can create verifications" ON verifications FOR INSERT
TO authenticated WITH CHECK (vendor_id IN (SELECT id FROM vendors WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can update all verifications" ON verifications FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- documents RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own documents" ON documents FOR SELECT
TO authenticated USING (uploaded_by IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Providers can read own documents" ON documents FOR SELECT
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Vendors can read own documents" ON documents FOR SELECT
TO authenticated USING (vendor_id IN (SELECT id FROM vendors WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all documents" ON documents FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Users can create documents" ON documents FOR INSERT
TO authenticated WITH CHECK (uploaded_by IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can update own documents" ON documents FOR UPDATE
TO authenticated USING (uploaded_by IN (SELECT id FROM profiles WHERE user_id = auth.uid()))
WITH CHECK (uploaded_by IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can update all documents" ON documents FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- verification_logs RLS
ALTER TABLE verification_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read all verification logs" ON verification_logs FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Admins can insert verification logs" ON verification_logs FOR INSERT
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- service_pricing_packages RLS
ALTER TABLE service_pricing_packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can read own pricing packages" ON service_pricing_packages FOR SELECT
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all pricing packages" ON service_pricing_packages FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Public can read active pricing packages" ON service_pricing_packages FOR SELECT
TO anon USING (is_active = true);

CREATE POLICY "Providers can create pricing packages" ON service_pricing_packages FOR INSERT
TO authenticated WITH CHECK (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Providers can update own pricing packages" ON service_pricing_packages FOR UPDATE
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())))
WITH CHECK (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can update all pricing packages" ON service_pricing_packages FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- otp_verifications RLS
ALTER TABLE otp_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own OTPs" ON otp_verifications FOR SELECT
TO authenticated USING (user_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Admins can read all OTPs" ON otp_verifications FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "System can insert OTPs" ON otp_verifications FOR INSERT
TO authenticated
WITH CHECK (true);

-- complaints RLS
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can read own complaints" ON complaints FOR SELECT
TO authenticated USING (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Providers can read own complaints" ON complaints FOR SELECT
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Vendors can read own complaints" ON complaints FOR SELECT
TO authenticated USING (vendor_id IN (SELECT id FROM vendors WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all complaints" ON complaints FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Customers can create complaints" ON complaints FOR INSERT
TO authenticated WITH CHECK (customer_id IN (SELECT id FROM customers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can update all complaints" ON complaints FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- complaint_actions RLS
ALTER TABLE complaint_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read all complaint actions" ON complaint_actions FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Admins can insert complaint actions" ON complaint_actions FOR INSERT
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- emergency_contacts RLS
ALTER TABLE emergency_contacts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can read own contacts" ON emergency_contacts FOR SELECT
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all contacts" ON emergency_contacts FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Providers can create contacts" ON emergency_contacts FOR INSERT
TO authenticated WITH CHECK (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Providers can update own contacts" ON emergency_contacts FOR UPDATE
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())))
WITH CHECK (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can update all contacts" ON emergency_contacts FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- emergency_alerts RLS
ALTER TABLE emergency_alerts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can read own alerts" ON emergency_alerts FOR SELECT
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can read all alerts" ON emergency_alerts FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Providers can create alerts" ON emergency_alerts FOR INSERT
TO authenticated WITH CHECK (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Admins can update all alerts" ON emergency_alerts FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- audit_logs RLS
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read all audit logs" ON audit_logs FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "System can insert audit logs" ON audit_logs FOR INSERT
TO authenticated
WITH CHECK (true);

-- system_settings RLS
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can read all settings" ON system_settings FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Public can read non-sensitive settings" ON system_settings FOR SELECT
TO anon USING (key NOT IN ('payment_keys', 'api_secrets', 'admin_passwords'));

CREATE POLICY "Admins can update all settings" ON system_settings FOR ALL
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- ai_analysis_cache RLS
ALTER TABLE ai_analysis_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Providers can read own cache" ON ai_analysis_cache FOR SELECT
TO authenticated USING (provider_id IN (SELECT id FROM providers WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Vendors can read own cache" ON ai_analysis_cache FOR SELECT
TO authenticated USING (vendor_id IN (SELECT id FROM vendors WHERE profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid())));

CREATE POLICY "Authenticated users can read all cache" ON ai_analysis_cache FOR SELECT
TO authenticated USING (true);

CREATE POLICY "System can insert cache" ON ai_analysis_cache FOR INSERT
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- face_match_results RLS (ADMIN SPECIFIC)
ALTER TABLE face_match_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read face match results" ON face_match_results FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Only admins can insert face match results" ON face_match_results FOR INSERT
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- admin_audit_logs RLS (ADMIN SPECIFIC)
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read admin audit logs" ON admin_audit_logs FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Only admins can insert admin audit logs" ON admin_audit_logs FOR INSERT
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- admin_notes RLS (ADMIN SPECIFIC)
ALTER TABLE admin_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read admin notes" ON admin_notes FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Only admins can create admin notes" ON admin_notes FOR INSERT
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Only admins can update admin notes" ON admin_notes FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- account_flags RLS (ADMIN SPECIFIC)
ALTER TABLE account_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read all account flags" ON account_flags FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Users can read own account flags" ON account_flags FOR SELECT
TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Only admins can create account flags" ON account_flags FOR INSERT
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Only admins can update account flags" ON account_flags FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- account_bans RLS (ADMIN SPECIFIC)
ALTER TABLE account_bans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read all account bans" ON account_bans FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Users can read own account bans" ON account_bans FOR SELECT
TO authenticated USING (profile_id IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Only admins can create account bans" ON account_bans FOR INSERT
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Only admins can update account bans" ON account_bans FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- payment_proofs RLS (ADMIN SPECIFIC)
ALTER TABLE payment_proofs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read all payment proofs" ON payment_proofs FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Uploaders can read own payment proofs" ON payment_proofs FOR SELECT
TO authenticated USING (uploaded_by IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Users can create payment proofs" ON payment_proofs FOR INSERT
TO authenticated WITH CHECK (uploaded_by IN (SELECT id FROM profiles WHERE user_id = auth.uid()));

CREATE POLICY "Only admins can update payment proofs" ON payment_proofs FOR UPDATE
TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- withdrawal_execution_logs RLS (ADMIN SPECIFIC)
ALTER TABLE withdrawal_execution_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can read withdrawal execution logs" ON withdrawal_execution_logs FOR SELECT
TO authenticated USING (is_admin());

CREATE POLICY "Only admins can insert withdrawal execution logs" ON withdrawal_execution_logs FOR INSERT
TO authenticated USING (is_admin()) WITH CHECK (is_admin());
```

### =====================
### SECTION E: SEED DATA
### =====================

```sql
-- Service Provider Categories (9 total)
INSERT INTO service_categories (name, name_urdu, icon, description, is_active, sort_order) VALUES
('Maid', 'خانہ دار', '🧹', 'Household cleaning and maid services', true, 1),
('Driver', 'ڈرائیور', '🚗', 'Personal and family driver services', true, 2),
('Babysitter', 'بچوں کی دیکھ بھال', '👶', 'Childcare and babysitting services', true, 3),
('Security Guard', 'سیکیورٹی گارڈ', '🛡️', 'Security and guard services', true, 4),
('Washerman', 'دھوبی', '👕', 'Laundry and washing services', true, 5),
('Domestic Helper', 'گھریلو مددگار', '🏠', 'General domestic help services', true, 6),
('Cook', 'باورچی', '👨‍🍳', 'Cooking and chef services', true, 7),
('Gardener', 'باغبان', '🌱', 'Gardening and landscaping services', true, 8),
('Tutor', 'استاد', '📚', 'Private tutoring and education services', true, 9);

-- Vendor Categories (7 total)
INSERT INTO service_categories (name, name_urdu, icon, description, is_active, sort_order) VALUES
('Supermarket', 'سپر مارکیٹ', '🏪', 'Grocery and supermarket items', true, 10),
('Meatshop', 'گوشت کی دکان', '🥩', 'Fresh meat and poultry shop', true, 11),
('Milkshop', 'دودھ کی دکان', '🥛', 'Dairy and milk products shop', true, 12),
('Water Plant', 'پانی کا پلانٹ', '💧', 'Water supply and purification plant', true, 13),
('Gas Cylinder Shop', 'گیس سلنڈر کی دکان', '⛽', 'Gas cylinder refill and supply shop', true, 14),
('Fruits and Vegetables Market', 'پھل اور سبزی منڈی', '🍎', 'Fresh fruits and vegetables market', true, 15),
('Bakery', 'بیکری', '🥖', 'Bakery and confectionery items', true, 16);
```

---

**End of Database Schema Document**
