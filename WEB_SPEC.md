# WEB_SPEC.md

## Muawin Admin Dashboard Backend Specification

---

### SECTION 1: ADMIN DASHBOARD OVERVIEW

#### **Dashboard** (`/admin/dashboard`)
- **Data Displayed**: Total users count, pending verifications count, open complaints count, completed jobs count
- **Actions**: Quick approve/reject verifications, view complaint details, navigate to management sections
- **Hardcoded Values**: All statistics (1,284 users, 452 jobs), verification queue data, complaints data
- **Navigation Links**: Complaints, Verification, Payments, Find User, Premium Customers, Featured Users

#### **User Management** (`/admin/users`)
- **Data Displayed**: Customer, Provider, Vendor accounts with profiles, status, verification badges
- **Actions**: Search users, filter by role, view detailed user profiles, manage accounts
- **Hardcoded Values**: All user data (names, emails, IDs, statuses, categories)

#### **User Details** (`/admin/users/[id]`)
- **Data Displayed**: Complete user profile, account statistics, verification status, transaction history
- **Actions**: View detailed information, manage user status, view activity logs
- **Hardcoded Values**: All user profile data, statistics, history

#### **Verification Queue** (`/admin/verification`)
- **Data Displayed**: Verification requests with provider info, category, status, submission date
- **Actions**: Filter by status, search providers, view details, export CSV
- **Hardcoded Values**: All verification data, status counts

#### **Verification Details** (`/admin/verification/[id]`)
- **Data Displayed**: AI face match results, image comparisons, quality reports, provider info
- **Actions**: Review AI recommendations, approve/reject verifications, add admin notes
- **Hardcoded Values**: All verification data, AI results, image URLs

#### **Complaint Management** (`/admin/complaint`)
- **Data Displayed**: Complaint list with urgency flags, status, involved parties
- **Actions**: Filter complaints, investigate cases, archive resolved issues
- **Hardcoded Values**: All complaint data, urgency indicators

#### **Complaint Review** (`/admin/complaint/[id]`)
- **Data Displayed**: Complaint details, job information, customer/provider profiles
- **Actions**: Apply disciplinary actions, add notes, resolve complaints
- **Hardcoded Values**: All complaint details, user profiles, action data

#### **Payment Withdrawals** (`/admin/payments`)
- **Data Displayed**: Withdrawal requests with provider info, amounts, fees, status
- **Actions**: Filter requests, process payments, view transaction details
- **Hardcoded Values**: All withdrawal data, fee calculations (10%)

#### **Payment Execution** (`/admin/payments/execute/[id]`)
- **Data Displayed**: Withdrawal details, account information, fee breakdown
- **Actions**: Select payout method, confirm transactions, upload payment proofs
- **Hardcoded Values**: All payment data, bank lists, account details

#### **Premium Customers** (`/admin/premium`)
- **Data Displayed**: PRO subscribers with plans, payment methods, status, expiry
- **Actions**: View subscription details, revoke premium access, audit payments
- **Hardcoded Values**: All customer data, pricing (Weekly: Rs. 10, Monthly: Rs. 99, Yearly: Rs. 1,000)

#### **Featured Ads** (`/admin/featured`)
- **Data Displayed**: Active featured ads with providers, packages, expiry, payment info
- **Actions**: View ad details, audit payments, terminate boosts
- **Hardcoded Values**: All featured ad data, pricing (Daily: Rs. 99, Weekly: Rs. 500, Monthly: Rs. 1,800)

---

### SECTION 2: HARDCODED DATA INVENTORY

#### **Dashboard Page**
- **File**: `dashboard/page.tsx`
- **Hardcoded**: Stats array with total users (1,284), completed jobs (452)
- **Replace with**: `profiles` table count, `jobs` table count
- **Query**: `supabase.from('profiles').select('id', { count: 'exact' })`
- **Priority**: High

- **File**: `dashboard/page.tsx`
- **Hardcoded**: pendingProviders array with provider data
- **Replace with**: `providers` table + `verifications` table
- **Query**: `supabase.from('providers').select('*, verifications(*)').eq('verification_status', 'pending')`
- **Priority**: High

- **File**: `dashboard/page.tsx`
- **Hardcoded**: complaints array with complaint data
- **Replace with**: `complaints` table
- **Query**: `supabase.from('complaints').select('*').eq('status', 'pending')`
- **Priority**: High

#### **User Management Page**
- **File**: `users/page.tsx`
- **Hardcoded**: mockUsers array with all user data
- **Replace with**: `profiles` + `customers` + `providers` + `vendors` tables
- **Query**: `supabase.from('profiles').select('*, customers(*), providers(*), vendors(*)')`
- **Priority**: High

#### **Verification Queue Page**
- **File**: `verification/page.tsx`
- **Hardcoded**: mockVerifications array with verification data
- **Replace with**: `verifications` table + `providers` table
- **Query**: `supabase.from('verifications').select('*, providers(*)')`
- **Priority**: High

#### **Verification Details Page**
- **File**: `verification/[id]/page.tsx`
- **Hardcoded**: mockVerificationData object with all verification details
- **Replace with**: `verifications` + `face_match_results` + `providers` tables
- **Query**: `supabase.from('verifications').select('*, face_match_results(*), providers(*)').eq('id', id)`
- **Priority**: High

#### **Complaint Management Page**
- **File**: `complaint/page.tsx`
- **Hardcoded**: mockComplaints array with complaint data
- **Replace with**: `complaints` table + `customers` + `providers` tables
- **Query**: `supabase.from('complaints').select('*, customers(*), providers(*)')`
- **Priority**: High

#### **Complaint Review Page**
- **File**: `complaint/[id]/page.tsx`
- **Hardcoded**: mockComplaints object with detailed complaint data
- **Replace with**: `complaints` + `jobs` + `customers` + `providers` tables
- **Query**: `supabase.from('complaints').select('*, jobs(*), customers(*), providers(*)').eq('id', id)`
- **Priority**: High

#### **Payment Withdrawals Page**
- **File**: `payments/page.tsx`
- **Hardcoded**: mockWithdrawals array with withdrawal data
- **Replace with**: `withdrawals` table + `providers` + `wallets` tables
- **Query**: `supabase.from('withdrawals').select('*, providers(*), wallets(*)')`
- **Priority**: High

#### **Payment Execution Page**
- **File**: `payments/execute/[id]/page.tsx`
- **Hardcoded**: mockTransactions object with payment details
- **Replace with**: `withdrawals` + `providers` + `wallets` tables
- **Query**: `supabase.from('withdrawals').select('*, providers(*), wallets(*)').eq('id', id)`
- **Priority**: High

- **File**: `payments/execute/[id]/page.tsx`
- **Hardcoded**: PAKISTANI_BANKS array with bank names
- **Replace with**: Static config or system_settings table
- **Query**: Static array or `supabase.from('system_settings').select('value').eq('key', 'pakistani_banks')`
- **Priority**: Medium

#### **Premium Customers Page**
- **File**: `premium/page.tsx`
- **Hardcoded**: initialPremiumCustomers array with subscription data
- **Replace with**: `subscriptions` table + `customers` + `payments` tables
- **Query**: `supabase.from('subscriptions').select('*, customers(*), payments(*)')`
- **Priority**: High

- **File**: `premium/page.tsx`
- **Hardcoded**: Pricing values (Weekly: Rs. 499, Monthly: Rs. 1,499, Yearly: Rs. 12,000)
- **Replace with**: Correct pricing (Weekly: Rs. 10, Monthly: Rs. 99, Yearly: Rs. 1,000)
- **Query**: Static config or `system_settings` table
- **Priority**: High

#### **Featured Ads Page**
- **File**: `featured/page.tsx`
- **Hardcoded**: initialFeaturedUsers array with ad data
- **Replace with**: `featured_ads` table + `providers` + `vendors` + `payments` tables
- **Query**: `supabase.from('featured_ads').select('*, providers(*), vendors(*), payments(*)')`
- **Priority**: High

- **File**: `featured/page.tsx`
- **Hardcoded**: Pricing values (Daily: Rs. 99, Weekly: Rs. 500, Monthly: Rs. 1,800)
- **Replace with**: Static config (already correct)
- **Query**: Static config
- **Priority**: Medium

#### **Authentication Page**
- **File**: `auth/login/page.tsx`
- **Hardcoded**: Login credentials (admin/admin123)
- **Replace with**: Supabase Auth
- **Query**: `supabase.auth.signInWithPassword({ email, password })`
- **Priority**: High

---

### SECTION 3: SUPABASE DIRECT OPERATIONS

#### **Admin Auth Operations**
- **Operation**: Admin login
- **Page**: `/auth/login`
- **Supabase table**: `auth.users` + `admin_users`
- **Query type**: select
- **Code example**: `supabase.auth.signInWithPassword({ email, password })`
- **Real time needed**: No

- **Operation**: Admin logout
- **Page**: All pages
- **Supabase table**: `auth.users`
- **Query type**: signOut
- **Code example**: `supabase.auth.signOut()`
- **Real time needed**: No

#### **User Management Operations**
- **Operation**: Browse all users
- **Page**: `/admin/users`
- **Supabase table**: `profiles` + `customers` + `providers` + `vendors`
- **Query type**: select
- **Code example**: `supabase.from('profiles').select('*, customers(*), providers(*), vendors(*)')`
- **Real time needed**: Yes

- **Operation**: Search users by name/ID
- **Page**: `/admin/users`
- **Supabase table**: `profiles`
- **Query type**: select
- **Code example**: `supabase.from('profiles').select('*').ilike('full_name', `%${query}%`)`
- **Real time needed**: No

- **Operation**: Filter users by role
- **Page**: `/admin/users`
- **Supabase table**: `profiles` + role-specific tables
- **Query type**: select
- **Code example**: `supabase.from('profiles').select('*, providers(*)').not('providers.id', 'is', null)`
- **Real time needed**: No

- **Operation**: View user details
- **Page**: `/admin/users/[id]`
- **Supabase table**: `profiles` + role-specific + related tables
- **Query type**: select
- **Code example**: `supabase.from('profiles').select('*, customers(*), providers(*), vendors(*), wallets(*)').eq('id', id)`
- **Real time needed**: Yes

#### **Verification Queue Operations**
- **Operation**: Browse verification queue
- **Page**: `/admin/verification`
- **Supabase table**: `verifications` + `providers` + `face_match_results`
- **Query type**: select
- **Code example**: `supabase.from('verifications').select('*, providers(*), face_match_results(*)').eq('status', 'pending')`
- **Real time needed**: Yes

- **Operation**: Filter verifications by status
- **Page**: `/admin/verification`
- **Supabase table**: `verifications`
- **Query type**: select
- **Code example**: `supabase.from('verifications').select('*').eq('status', 'approved')`
- **Real time needed**: No

- **Operation**: View verification details
- **Page**: `/admin/verification/[id]`
- **Supabase table**: `verifications` + `face_match_results` + `providers` + `documents`
- **Query type**: select
- **Code example**: `supabase.from('verifications').select('*, face_match_results(*), providers(*), documents(*)').eq('id', id)`
- **Real time needed**: Yes

- **Operation**: Approve verification
- **Page**: `/admin/verification/[id]`
- **Supabase table**: `verifications`
- **Query type**: update
- **Code example**: `supabase.from('verifications').update({ status: 'approved', admin_note: note }).eq('id', id)`
- **Real time needed**: Yes

- **Operation**: Reject verification
- **Page**: `/admin/verification/[id]`
- **Supabase table**: `verifications`
- **Query type**: update
- **Code example**: `supabase.from('verifications').update({ status: 'rejected', admin_note: note }).eq('id', id)`
- **Real time needed**: Yes

#### **Complaint Management Operations**
- **Operation**: Browse complaints
- **Page**: `/admin/complaint`
- **Supabase table**: `complaints` + `customers` + `providers` + `jobs`
- **Query type**: select
- **Code example**: `supabase.from('complaints').select('*, customers(*), providers(*), jobs(*)')`
- **Real time needed**: Yes

- **Operation**: Filter complaints by status/urgency
- **Page**: `/admin/complaint`
- **Supabase table**: `complaints`
- **Query type**: select
- **Code example**: `supabase.from('complaints').select('*').eq('status', 'pending').eq('urgent', true)`
- **Real time needed**: No

- **Operation**: View complaint details
- **Page**: `/admin/complaint/[id]`
- **Supabase table**: `complaints` + `customers` + `providers` + `jobs`
- **Query type**: select
- **Code example**: `supabase.from('complaints').select('*, customers(*), providers(*), jobs(*)').eq('id', id)`
- **Real time needed**: Yes

- **Operation**: Apply disciplinary action
- **Page**: `/admin/complaint/[id]`
- **Supabase table**: `account_flags` + `account_bans` + `complaint_actions`
- **Query type**: insert
- **Code example**: `supabase.from('account_bans').insert({ profile_id, reason, duration, created_by: adminId })`
- **Real time needed**: Yes

#### **Withdrawal Management Operations**
- **Operation**: Browse withdrawal requests
- **Page**: `/admin/payments`
- **Supabase table**: `withdrawals` + `providers` + `vendors` + `wallets`
- **Query type**: select
- **Code example**: `supabase.from('withdrawals').select('*, providers(*), vendors(*), wallets(*)')`
- **Real time needed**: Yes

- **Operation**: Filter withdrawals by status
- **Page**: `/admin/payments`
- **Supabase table**: `withdrawals`
- **Query type**: select
- **Code example**: `supabase.from('withdrawals').select('*').eq('status', 'pending')`
- **Real time needed**: No

- **Operation**: View withdrawal details
- **Page**: `/admin/payments/execute/[id]`
- **Supabase table**: `withdrawals` + `providers` + `vendors` + `wallets`
- **Query type**: select
- **Code example**: `supabase.from('withdrawals').select('*, providers(*), vendors(*), wallets(*)').eq('id', id)`
- **Real time needed**: Yes

- **Operation**: Mark withdrawal as paid
- **Page**: `/admin/payments/execute/[id]`
- **Supabase table**: `withdrawals` + `transactions` + `withdrawal_execution_logs`
- **Query type**: update + insert
- **Code example**: `supabase.from('withdrawals').update({ status: 'processed' }).eq('id', id)`
- **Real time needed**: Yes

#### **Featured Ads Management**
- **Operation**: Browse featured ads
- **Page**: `/admin/featured`
- **Supabase table**: `featured_ads` + `providers` + `vendors` + `payments`
- **Query type**: select
- **Code example**: `supabase.from('featured_ads').select('*, providers(*), vendors(*), payments(*)')`
- **Real time needed**: Yes

- **Operation**: Terminate featured ad
- **Page**: `/admin/featured`
- **Supabase table**: `featured_ads`
- **Query type**: update
- **Code example**: `supabase.from('featured_ads').update({ is_active: false, end_date: new Date() }).eq('id', id)`
- **Real time needed**: Yes

#### **Analytics and Statistics**
- **Operation**: Dashboard statistics
- **Page**: `/admin/dashboard`
- **Supabase table**: Multiple tables
- **Query type**: select (count)
- **Code example**: `supabase.from('profiles').select('id', { count: 'exact' })`
- **Real time needed**: Yes

#### **Premium Subscription Management**
- **Operation**: Browse premium customers
- **Page**: `/admin/premium`
- **Supabase table**: `subscriptions` + `customers` + `payments`
- **Query type**: select
- **Code example**: `supabase.from('subscriptions').select('*, customers(*), payments(*)').eq('status', 'active')`
- **Real time needed**: Yes

- **Operation**: Revoke premium access
- **Page**: `/admin/premium`
- **Supabase table**: `subscriptions`
- **Query type**: update
- **Code example**: `supabase.from('subscriptions').update({ status: 'cancelled' }).eq('id', id)`
- **Real time needed**: Yes

---

### SECTION 4: NODE.JS API CALLS NEEDED

#### **Face Match Analysis**
- **Method**: POST
- **Route**: `/api/admin/verification/face-match`
- **Purpose**: Trigger AI face matching for verification
- **Why Node.js needed**: Python microservice integration, image processing
- **Request body**: `{ verification_id: string, cnic_url: string, selfie_url: string }`
- **Response**: `{ match_result: object, confidence: number, decision: string }`
- **Which admin page uses it**: `/admin/verification/[id]`
- **Supabase tables affected**: `face_match_results`, `verifications`
- **Authentication**: admin only

#### **Email Notifications**
- **Method**: POST
- **Route**: `/api/admin/notifications/send-email`
- **Purpose**: Send email notifications for bans, approvals, rejections
- **Why Node.js needed**: Email service integration, templating
- **Request body**: `{ to: string, subject: string, template: string, data: object }`
- **Response**: `{ success: boolean, message: string }`
- **Which admin page uses it**: `/admin/complaint/[id]`, `/admin/verification/[id]`
- **Supabase tables affected**: None (external service)
- **Authentication**: admin only

#### **Payment Processing**
- **Method**: POST
- **Route**: `/api/admin/payments/process-withdrawal`
- **Purpose**: Process withdrawal payments via payment gateway
- **Why Node.js needed**: External payment API integration (Safepay)
- **Request body**: `{ withdrawal_id: string, method: string, account_details: object }`
- **Response**: `{ success: boolean, transaction_id: string, status: string }`
- **Which admin page uses it**: `/admin/payments/execute/[id]`
- **Supabase tables affected**: `withdrawals`, `transactions`, `payment_proofs`
- **Authentication**: admin only

#### **PDF Report Generation**
- **Method**: POST
- **Route**: `/api/admin/reports/generate`
- **Purpose**: Generate PDF reports for analytics, audits
- **Why Node.js needed**: PDF generation, complex data processing
- **Request body**: `{ report_type: string, filters: object, format: 'pdf' }`
- **Response**: `{ file_url: string, download_link: string }`
- **Which admin page uses it**: Dashboard, Analytics pages
- **Supabase tables affected**: None (file storage)
- **Authentication**: admin only

#### **Mass Notifications**
- **Method**: POST
- **Route**: `/api/admin/notifications/broadcast`
- **Purpose**: Send push notifications to mobile app users
- **Why Node.js needed**: Firebase Cloud Messaging integration
- **Request body**: `{ target_users: array, message: string, data: object }`
- **Response**: `{ success: boolean, sent_count: number }`
- **Which admin page uses it**: Emergency alerts, system announcements
- **Supabase tables affected**: `notifications`, `emergency_alerts`
- **Authentication**: admin only

#### **Revenue Analytics**
- **Method**: GET
- **Route**: `/api/admin/analytics/revenue`
- **Purpose**: Complex revenue calculations and projections
- **Why Node.js needed**: Complex calculations, multiple table joins
- **Request body**: None (query params)
- **Response**: `{ total_revenue: number, projections: object, breakdown: array }`
- **Which admin page uses it**: Dashboard analytics
- **Supabase tables affected**: Multiple (read-only)
- **Authentication**: admin only

#### **Audit Log Export**
- **Method**: GET
- **Route**: `/api/admin/audit/export`
- **Purpose**: Export audit logs in various formats
- **Why Node.js needed**: File generation, format conversion
- **Request body**: None (query params)
- **Response**: `{ file_url: string, format: string }`
- **Which admin page uses it**: Admin audit pages
- **Supabase tables affected**: `admin_audit_logs`, `audit_logs`
- **Authentication**: admin only

---

### SECTION 5: REAL TIME SUBSCRIPTIONS

#### **New Verification Submitted**
- **Section name**: Verification queue badge
- **Which page**: `/admin/dashboard`, `/admin/verification`
- **Supabase table to subscribe to**: `verifications`
- **Event**: INSERT
- **What changes in UI**: Increment pending verification count, add new item to queue

#### **Verification Status Updated**
- **Section name**: Verification queue
- **Which page**: `/admin/verification`, `/admin/verification/[id]`
- **Supabase table to subscribe to**: `verifications`
- **Event**: UPDATE
- **What changes in UI**: Update status, remove from pending queue, refresh details

#### **New Complaint Filed**
- **Section name**: Complaints badge
- **Which page**: `/admin/dashboard`, `/admin/complaint`
- **Supabase table to subscribe to**: `complaints`
- **Event**: INSERT
- **What changes in UI**: Increment open complaints count, add new complaint to list

#### **Complaint Status Updated**
- **Section name**: Complaint list
- **Which page**: `/admin/complaint`, `/admin/complaint/[id]`
- **Supabase table to subscribe to**: `complaints`
- **Event**: UPDATE
- **What changes in UI**: Update status, remove from active list, refresh details

#### **New Withdrawal Request**
- **Section name**: Withdrawal badge
- **Which page**: `/admin/dashboard`, `/admin/payments`
- **Supabase table to subscribe to**: `withdrawals`
- **Event**: INSERT
- **What changes in UI**: Increment pending withdrawals count, add new request to list

#### **Withdrawal Status Updated**
- **Section name**: Withdrawal list
- **Which page**: `/admin/payments`, `/admin/payments/execute/[id]`
- **Supabase table to subscribe to**: `withdrawals`
- **Event**: UPDATE
- **What changes in UI**: Update status, remove from pending list, refresh details

#### **User Account Status Changed**
- **Section name**: User management
- **Which page**: `/admin/users`, `/admin/users/[id]`
- **Supabase table to subscribe to**: `profiles`, `account_bans`, `account_flags`
- **Event**: UPDATE, INSERT
- **What changes in UI**: Update user status, show ban/flag indicators

#### **New Premium Subscription**
- **Section name**: Premium customers
- **Which page**: `/admin/premium`
- **Supabase table to subscribe to**: `subscriptions`
- **Event**: INSERT
- **What changes in UI**: Add new premium customer, update count

#### **Featured Ad Status Changed**
- **Section name**: Featured ads
- **Which page**: `/admin/featured`
- **Supabase table to subscribe to**: `featured_ads`
- **Event**: UPDATE, INSERT, DELETE
- **What changes in UI**: Update ad list, show expiry status, remove terminated ads

#### **Face Match Result Available**
- **Section name**: Verification details
- **Which page**: `/admin/verification/[id]`
- **Supabase table to subscribe to**: `face_match_results`
- **Event**: INSERT
- **What changes in UI**: Display AI analysis results, update recommendations

---

### SECTION 6: ADMIN AUTHENTICATION

#### **Admin Login Flow via Supabase Auth**
1. Admin enters email/password on login page
2. Call `supabase.auth.signInWithPassword({ email, password })`
3. Supabase validates credentials against `auth.users` table
4. Check if user exists in `admin_users` table with admin role
5. Store session in Supabase auth
6. Redirect to `/admin/dashboard`

#### **Admin Role Identification**
- **Table**: `admin_users`
- **Columns**: `user_id` (FK to auth.users), `role` ('super_admin', 'admin'), `is_active`
- **Query**: `supabase.from('admin_users').select('*').eq('user_id', auth.user.id).eq('is_active', true)`
- **Role levels**: 
  - `super_admin`: Full system access
  - `admin`: Standard admin access
  - `moderator`: Limited access (complaints, verifications only)

#### **Super Admin vs Regular Admin**
- **Super Admin Only Pages**:
  - System settings management
  - Admin user management
  - Revenue analytics
  - Audit log exports
- **Regular Admin Access**:
  - User management
  - Verification queue
  - Complaint management
  - Payment processing
- **Moderator Access**:
  - Verification review
  - Complaint handling
  - Basic user viewing

#### **Session Management**
- Supabase handles session automatically
- JWT tokens stored in browser cookies
- Session refresh handled by Supabase client
- Logout calls `supabase.auth.signOut()`

#### **Row Level Security for Admin**
- **Policies**: All admin tables have RLS policies
- **Admin Check**: `is_admin()` function checks `admin_users` table
- **Super Admin Check**: `is_super_admin()` function for elevated permissions
- **Example Policy**:
  ```sql
  CREATE POLICY "Admins can read all data" ON table_name FOR SELECT
  TO authenticated USING (is_admin());
  ```

---

### SECTION 7: DASHBOARD ANALYTICS

#### **Total Users Count**
- **What number represents**: All registered users (customers + providers + vendors)
- **Which Supabase table**: `profiles`
- **Exact Supabase query**: `supabase.from('profiles').select('id', { count: 'exact' })`
- **Direct Supabase**: Yes
- **How often it updates**: Real-time on profile changes

#### **Pending Verifications Count**
- **What number represents**: Verification requests awaiting admin review
- **Which Supabase table**: `verifications`
- **Exact Supabase query**: `supabase.from('verifications').select('id', { count: 'exact' }).eq('status', 'pending')`
- **Direct Supabase**: Yes
- **How often it updates**: Real-time on verification status changes

#### **Open Complaints Count**
- **What number represents**: Active complaints requiring investigation
- **Which Supabase table**: `complaints`
- **Exact Supabase query**: `supabase.from('complaints').select('id', { count: 'exact' }).in('status', ['pending', 'in_review'])`
- **Direct Supabase**: Yes
- **How often it updates**: Real-time on complaint status changes

#### **Completed Jobs Count**
- **What number represents**: Successfully completed service jobs
- **Which Supabase table**: `jobs`
- **Exact Supabase query**: `supabase.from('jobs').select('id', { count: 'exact' }).eq('status', 'completed')`
- **Direct Supabase**: Yes
- **How often it updates**: Real-time on job status changes

#### **Total Revenue (Monthly)**
- **What number represents**: Total platform revenue for current month
- **Which Supabase table**: `payments` + `transactions`
- **Exact Supabase query**: Complex aggregation requiring Node.js
- **Node.js needed**: Yes (commission calculations, multiple joins)
- **How often it updates**: Daily cache refresh

#### **Active Premium Users**
- **What number represents**: Currently subscribed PRO customers
- **Which Supabase table**: `subscriptions`
- **Exact Supabase query**: `supabase.from('subscriptions').select('id', { count: 'exact' }).eq('status', 'active')`
- **Direct Supabase**: Yes
- **How often it updates**: Real-time on subscription changes

#### **Pending Withdrawals Amount**
- **What number represents**: Total amount awaiting withdrawal processing
- **Which Supabase table**: `withdrawals`
- **Exact Supabase query**: `supabase.from('withdrawals').select('amount').eq('status', 'pending')`
- **Direct Supabase**: Yes
- **How often it updates**: Real-time on withdrawal status changes

#### **Featured Ads Revenue**
- **What number represents**: Monthly revenue from featured advertisements
- **Which Supabase table**: `featured_ads` + `payments`
- **Exact Supabase query**: Complex join requiring Node.js
- **Node.js needed**: Yes (price calculations, date filtering)
- **How often it updates**: Daily cache refresh

---

### SECTION 8: VERIFICATION SYSTEM

#### **Supabase Side**

##### **Admin Views Verification Queue**
- **Table**: `verifications` + `providers` + `face_match_results`
- **Query**: `supabase.from('verifications').select('*, providers(*), face_match_results(*)').eq('status', 'pending')`
- **Display**: Provider info, verification status, AI results
- **Real-time**: Subscribe to `verifications` table changes

##### **Face Match Results Display**
- **Table**: `face_match_results`
- **Query**: `supabase.from('face_match_results').select('*').eq('verification_id', id)`
- **Display**: Confidence score, decision, metrics, recommendation
- **Images**: Stored in Supabase Storage, URLs in `documents` table

##### **Approval/Rejection Storage**
- **Table**: `verifications`
- **Update Query**: `supabase.from('verifications').update({ status, admin_note, processed_at, processed_by }).eq('id', id)`
- **Status Options**: 'approved', 'rejected', 'needs_more_info'
- **Audit Trail**: Automatic via RLS and triggers

##### **Audit Trail Requirements**
- **Table**: `admin_audit_logs`
- **Trigger**: Automatic on verification status changes
- **Fields**: `admin_user_id`, `action`, `target_entity_type`, `target_entity_id`, `old_values`, `new_values`
- **Query**: `supabase.from('admin_audit_logs').select('*').eq('target_entity_id', verificationId)`

#### **Node.js Side**

##### **Python Service Integration**
- **Endpoint**: `/api/admin/verification/trigger-face-match`
- **Purpose**: Call Python microservice for face analysis
- **Request**: `{ verification_id, cnic_image_url, selfie_image_url }`
- **Python Service**: Processes images, returns match results
- **Response**: `{ confidence, decision, metrics, recommendation }`

##### **Results Storage**
- **Endpoint**: `/api/admin/verification/save-results`
- **Purpose**: Save Python AI results to Supabase
- **Tables**: `face_match_results`, `verification_logs`
- **Process**: Insert AI results, update verification status
- **Response**: `{ success, verification_id, results }`

##### **Email Notifications**
- **Endpoint**: `/api/admin/verification/send-notification`
- **Purpose**: Send approval/rejection emails to providers
- **Templates**: Approval email, rejection email, request more info
- **Integration**: Email service (SendGrid/SES)
- **Response**: `{ success, email_id, delivery_status }`

---

### SECTION 9: COMPLAINT MANAGEMENT

#### **Flag Action**
- **Supabase tables update**: `account_flags` (INSERT), `complaint_actions` (INSERT)
- **Query**: `supabase.from('account_flags').insert({ profile_id, reason, created_by: adminId })`
- **Node.js actions**: 
  - Send notification email to flagged user
  - Create in-app notification
  - Log action in audit trail
- **Audit log entries**: `admin_audit_logs` (INSERT), `complaint_actions` (INSERT)
- **Provider/Vendor receives**: Email notification, in-app alert, flag visible on profile

#### **Warning Action**
- **Supabase tables update**: `account_flags` (INSERT), `complaint_actions` (INSERT)
- **Query**: `supabase.from('account_flags').insert({ profile_id, reason, severity: 'warning', created_by: adminId })`
- **Node.js actions**:
  - Send formal warning email
  - Create in-app notification with severity
  - Update user warning count
- **Audit log entries**: `admin_audit_logs` (INSERT), `complaint_actions` (INSERT)
- **Provider/Vendor receives**: Email warning, in-app notification, warning count increment

#### **Ban Action**
- **Supabase tables update**: `account_bans` (INSERT), `profiles` (UPDATE), `complaint_actions` (INSERT)
- **Query**: 
  ```sql
  supabase.from('account_bans').insert({ 
    profile_id, reason, duration, end_date, created_by: adminId 
  })
  supabase.from('profiles').update({ is_active: false }).eq('id', profileId)
  ```
- **Node.js actions**:
  - Send ban notification email
  - Create emergency in-app notification
  - Invalidate user sessions
  - Notify mobile app via push notification
- **Audit log entries**: `admin_audit_logs` (INSERT), `complaint_actions` (INSERT), `account_bans` (INSERT)
- **Provider/Vendor receives**: Ban email, immediate app logout, account suspension notice

#### **Dismiss Action**
- **Supabase tables update**: `complaints` (UPDATE), `complaint_actions` (INSERT)
- **Query**: `supabase.from('complaints').update({ status: 'dismissed', resolution_note }).eq('id', complaintId)`
- **Node.js actions**:
  - Send resolution email to complainant
  - Close notification threads
  - Update analytics
- **Audit log entries**: `admin_audit_logs` (INSERT), `complaint_actions` (INSERT)
- **Provider/Vendor receives**: No action (case dismissed in their favor)

---

### SECTION 10: WITHDRAWAL MANAGEMENT

#### **View Pending Withdrawals (Supabase)**
- **Table**: `withdrawals` + `providers` + `wallets`
- **Query**: `supabase.from('withdrawals').select('*, providers(*), wallets(*)').eq('status', 'pending')`
- **Display**: Provider info, amount, fee, payout, method, request date
- **Real-time**: Subscribe to `withdrawals` table changes

#### **Mark as Paid (Supabase + Node.js)**
- **Supabase operations**:
  ```sql
  UPDATE withdrawals SET status = 'processed', processed_at = NOW(), processed_by = adminId WHERE id = withdrawalId
  INSERT INTO transactions (wallet_id, type, amount, description, payment_id) VALUES (walletId, 'debit', amount, 'Withdrawal processed', paymentId)
  INSERT INTO withdrawal_execution_logs (withdrawal_id, admin_id, action, details) VALUES (withdrawalId, adminId, 'processed', details)
  ```
- **Node.js actions**:
  - Call payment gateway API (Safepay)
  - Send payment confirmation email
  - Create in-app notification
  - Update analytics
- **Response**: `{ success, transaction_id, payment_reference }`

#### **Reject Withdrawal (Supabase + Node.js)**
- **Supabase operations**:
  ```sql
  UPDATE withdrawals SET status = 'rejected', rejection_reason = reason, rejected_at = NOW(), rejected_by = adminId WHERE id = withdrawalId
  UPDATE wallets SET balance = balance + amount WHERE id = walletId
  INSERT INTO transactions (wallet_id, type, amount, description) VALUES (walletId, 'credit', amount, 'Withdrawal rejected - amount refunded')
  ```
- **Node.js actions**:
  - Send rejection email with reason
  - Create in-app notification
  - Log rejection for audit
- **Response**: `{ success, refunded_amount, reason }`

#### **Upload Payment Proof (Supabase Storage)**
- **Storage bucket**: `payment-proofs`
- **File path**: `withdrawals/{withdrawal_id}/proof_{timestamp}.{ext}`
- **Supabase operations**:
  ```sql
  INSERT INTO payment_proofs (withdrawal_id, file_url, file_name, uploaded_by) VALUES (withdrawalId, fileUrl, fileName, adminId)
  UPDATE withdrawals SET payment_proof_id = proofId WHERE id = withdrawalId
  ```
- **Node.js actions**: None (direct Supabase Storage upload)
- **Response**: `{ success, file_url, proof_id }`

---

### SECTION 11: SUPABASE STORAGE

#### **Verification Documents**
- **Storage bucket**: `verification-documents`
- **File types**: CNIC images, selfie photos, supporting documents
- **Who uploaded**: Providers/Vendors during verification process
- **Admin access level**: Read-only viewing, download permissions
- **File structure**: `verifications/{verification_id}/cnic_{timestamp}.jpg`, `verifications/{verification_id}/selfie_{timestamp}.jpg`

#### **Payment Proofs**
- **Storage bucket**: `payment-proofs`
- **File types**: Bank transfer receipts, mobile wallet screenshots
- **Who uploaded**: Admin during withdrawal processing
- **Admin access level**: Full CRUD access
- **File structure**: `withdrawals/{withdrawal_id}/proof_{timestamp}.{ext}`

#### **Profile Images**
- **Storage bucket**: `profile-images`
- **File types**: Avatar images, profile photos
- **Who uploaded**: Users via mobile app
- **Admin access level**: Read-only viewing
- **File structure**: `profiles/{profile_id}/avatar_{timestamp}.{ext}`

#### **Service Documents**
- **Storage bucket**: `service-documents`
- **File types**: Certificates, licenses, portfolio images
- **Who uploaded**: Providers/Vendors
- **Admin access level**: Read-only viewing during verification
- **File structure**: `documents/{document_id}/{filename}.{ext}`

#### **Complaint Evidence**
- **Storage bucket**: `complaint-evidence`
- **File types**: Screenshots, photos, videos, audio recordings
- **Who uploaded**: Customers via mobile app
- **Admin access level**: Read-only viewing during complaint review
- **File structure**: `complaints/{complaint_id}/evidence_{timestamp}.{ext}`

#### **Admin Generated Files**
- **Storage bucket**: `admin-files`
- **File types**: PDF reports, audit exports, system logs
- **Who uploaded**: Admin system
- **Admin access level**: Full CRUD access
- **File structure**: `reports/{report_type}/{date}/{filename}.pdf`

---

### SECTION 12: ENVIRONMENT VARIABLES

#### **Next.js Environment Variables**
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Node.js Backend
NODE_JS_BACKEND_URL=http://localhost:3001/api
NEXT_PUBLIC_API_URL=http://localhost:3001

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@muawin.com
SMTP_PASS=app_password

# Payment Gateway
SAFEPAY_API_KEY=sk_test_xxx
SAFEPAY_SECRET_KEY=sk_test_xxx
SAFEPAY_WEBHOOK_SECRET=whsec_xxx

# Firebase Cloud Messaging
FCM_SERVER_KEY=AAAAXXX
NEXT_PUBLIC_FCM_VAPID_KEY=BNxxx

# File Storage
SUPABASE_STORAGE_URL=https://your-project.supabase.co/storage/v1
MAX_FILE_SIZE=10485760

# Python AI Service
PYTHON_AI_URL=http://localhost:8000
PYTHON_AI_API_KEY=secret_xxx

# Admin Configuration
ADMIN_EMAIL=admin@muawin.com
SUPER_ADMIN_EMAIL=ceo@muawin.com

# Analytics
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
SENTRY_DSN=https://xxx@sentry.io/xxx
```

---

### SECTION 13: BUILD PRIORITIES

#### **Priority 1: Admin Auth + Login**
- **Tasks**: Implement Supabase Auth, create admin_users table, setup RLS policies
- **Files**: `auth/login/page.tsx`, middleware, auth helpers
- **Dependencies**: Supabase project setup
- **Estimated time**: 2-3 days

#### **Priority 2: Dashboard Stats**
- **Tasks**: Replace hardcoded stats with Supabase queries, implement real-time updates
- **Files**: `dashboard/page.tsx`
- **Dependencies**: Admin auth completion
- **Estimated time**: 2-3 days

#### **Priority 3: User Management**
- **Tasks**: Connect user list and details to Supabase tables, implement search/filter
- **Files**: `users/page.tsx`, `users/[id]/page.tsx`
- **Dependencies**: Dashboard stats
- **Estimated time**: 3-4 days

#### **Priority 4: Verification Queue**
- **Tasks**: Connect verification list and details, integrate Python AI service
- **Files**: `verification/page.tsx`, `verification/[id]/page.tsx`
- **Dependencies**: User management, Python service
- **Estimated time**: 4-5 days

#### **Priority 5: Complaint Management**
- **Tasks**: Connect complaint system, implement disciplinary actions, email notifications
- **Files**: `complaint/page.tsx`, `complaint/[id]/page.tsx`
- **Dependencies**: Verification system, email service
- **Estimated time**: 4-5 days

#### **Priority 6: Withdrawal Management**
- **Tasks**: Connect withdrawal system, payment gateway integration, proof uploads
- **Files**: `payments/page.tsx`, `payments/execute/[id]/page.tsx`
- **Dependencies**: Complaint management, payment gateway
- **Estimated time**: 5-6 days

#### **Priority 7: Real-time Subscriptions**
- **Tasks**: Implement Supabase real-time subscriptions across all admin pages
- **Files**: All admin pages, real-time hooks
- **Dependencies**: All core functionality
- **Estimated time**: 3-4 days

#### **Priority 8: AI Features**
- **Tasks**: Complete Python AI integration, advanced analytics, PDF reports
- **Files**: Advanced admin features, analytics pages
- **Dependencies**: Real-time subscriptions
- **Estimated time**: 5-7 days

---

## Summary

The Muawin admin dashboard requires comprehensive backend integration with Supabase for data operations and Node.js for complex logic. The system handles user management, verification processing, complaint resolution, and payment processing through a well-structured admin interface.

**Key Integration Points:**
- **Supabase Direct**: Most CRUD operations, real-time subscriptions, file storage
- **Node.js API**: AI face matching, email notifications, payment processing, complex analytics
- **Real-time Updates**: Critical for verification queue, complaints, withdrawals
- **Authentication**: Supabase Auth with role-based access control
- **Storage**: Organized buckets for different file types with proper access controls

The build priorities ensure a phased approach, starting with authentication and basic functionality, then progressively adding complex features and real-time capabilities.
