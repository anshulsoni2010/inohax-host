# Test Registration System

This document explains how the test registration system works in the Inohax application.

## Overview

The application has two separate registration systems:

1. **Real Registrations**: These come from the website and are stored in the `registrations` collection.
2. **Test Registrations**: These are created using the test script and are stored in the `test_registrations` collection.

This separation ensures that test data doesn't contaminate your real user data.

## How It Works

### Real Registrations

- Endpoint: `/api/registration`
- Collection: `registrations`
- Behavior: Saves registration data and sends confirmation emails

### Test Registrations

- Endpoint: `/api/test-registration`
- Collection: `test_registrations`
- Behavior: Saves registration data but does NOT send any emails

## Using the Test System

### Running a Test Registration

To create a test registration, run:

```bash
node test-registration.js
```

This will:
1. Create a test registration with sample data
2. Save it to the `test_registrations` collection
3. Log what would have happened (emails that would have been sent)
4. Return a success response

### Viewing Registrations

To view all registrations in both collections, run:

```bash
node view-registrations.js
```

This will display:
1. The most recent real registrations from the `registrations` collection
2. The most recent test registrations from the `test_registrations` collection
3. The total count of registrations in each collection

## Benefits

Using separate collections for test and real registrations provides several benefits:

1. **Data Integrity**: Your real user data remains clean and separate from test data
2. **Testing**: You can test the registration process without sending real emails
3. **Analysis**: You can easily distinguish between real and test registrations
4. **Development**: You can test new features without affecting real users

## Technical Details

The test registration system uses a separate model (`TestRegistration`) and API endpoint (`/api/test-registration`) but shares most of the validation logic with the real registration system.

The main differences are:
1. Test registrations don't send actual emails
2. Test registrations are stored in a separate collection
3. Test registrations don't have an end date check

## Best Practices

1. Always use the test registration system during development and testing
2. Use the view-registrations.js script to verify that data is being saved correctly
3. Periodically clean up old test registrations to keep your database tidy
