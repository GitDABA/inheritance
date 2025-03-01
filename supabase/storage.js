const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

// Check if environment variables are set
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Environment variables NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY must be set');
  process.exit(1);
}

// Create Supabase client with the service key for admin privileges
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupStorageBucket() {
  try {
    // Check if the bucket already exists
    const { data: existingBuckets, error: getBucketsError } = await supabase.storage.listBuckets();
    
    if (getBucketsError) {
      throw getBucketsError;
    }
    
    const bucketExists = existingBuckets.some(bucket => bucket.name === 'item-images');
    
    if (!bucketExists) {
      console.log('Creating item-images bucket...');
      
      // Create the bucket
      const { error: createBucketError } = await supabase.storage.createBucket('item-images', {
        public: true
      });
      
      if (createBucketError) {
        throw createBucketError;
      }
      
      console.log('Bucket created successfully');
    } else {
      console.log('item-images bucket already exists');
    }
    
    // Set storage policies (these will overwrite any existing policies)
    console.log('Setting storage policies...');
    
    // Allow anyone to read files
    const { error: selectPolicyError } = await supabase
      .storage
      .from('item-images')
      .createPolicy('Everyone can view', {
        type: 'select',
        definition: 'true'
      });
    
    if (selectPolicyError) {
      console.warn('Error setting select policy:', selectPolicyError);
    }
    
    // Only authenticated users can upload
    const { error: insertPolicyError } = await supabase
      .storage
      .from('item-images')
      .createPolicy('Authenticated users can upload', {
        type: 'insert',
        definition: "auth.role() = 'authenticated'"
      });
    
    if (insertPolicyError) {
      console.warn('Error setting insert policy:', insertPolicyError);
    }
    
    // Users can only update their own uploads
    const { error: updatePolicyError } = await supabase
      .storage
      .from('item-images')
      .createPolicy('Users can update own images', {
        type: 'update',
        definition: "auth.uid() = (SELECT user_id FROM items WHERE image_url LIKE '%' || storage.filename(name) || '%')"
      });
    
    if (updatePolicyError) {
      console.warn('Error setting update policy:', updatePolicyError);
    }
    
    console.log('Storage setup completed successfully');
    
  } catch (error) {
    console.error('Error setting up storage:', error);
    process.exit(1);
  }
}

// Run the setup
setupStorageBucket();
