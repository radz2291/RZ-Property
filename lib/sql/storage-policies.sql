-- Script to create a policy for allowing DELETE operations on the property-images bucket

-- First, check if the policy already exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'storage'
        AND tablename = 'objects'
        AND policyname = 'Allow admins to delete property images'
    ) THEN
        -- Create a policy that allows authenticated users to delete from the property-images bucket
        EXECUTE 'CREATE POLICY "Allow admins to delete property images" 
                ON storage.objects 
                FOR DELETE 
                USING (bucket_id = ''property-images''::text)';

        RAISE NOTICE 'DELETE policy for property-images bucket created successfully.';
    ELSE
        RAISE NOTICE 'DELETE policy for property-images bucket already exists.';
    END IF;
END
$$;

-- Enable RLS on storage.objects if not already enabled
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_tables
        WHERE schemaname = 'storage'
        AND tablename = 'objects'
        AND rowsecurity = true
    ) THEN
        EXECUTE 'ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY';
        RAISE NOTICE 'Row Level Security enabled on storage.objects table.';
    ELSE
        RAISE NOTICE 'Row Level Security already enabled on storage.objects table.';
    END IF;
END
$$;

-- Also ensure SELECT policy exists, which is required for deletion
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE schemaname = 'storage'
        AND tablename = 'objects'
        AND policyname = 'Allow select access to property images'
    ) THEN
        -- Create a policy that allows authenticated users to select from the property-images bucket
        EXECUTE 'CREATE POLICY "Allow select access to property images" 
                ON storage.objects 
                FOR SELECT 
                USING (bucket_id = ''property-images''::text)';

        RAISE NOTICE 'SELECT policy for property-images bucket created successfully.';
    ELSE
        RAISE NOTICE 'SELECT policy for property-images bucket already exists.';
    END IF;
END
$$;
