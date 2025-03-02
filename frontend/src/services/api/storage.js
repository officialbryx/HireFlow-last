import { supabase } from '../supabaseClient';

export const storageApi = {
  async uploadCompanyLogo(file) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      
      const { data: fileData, error: fileError } = await supabase.storage
        .from("company-logos")
        .upload(`logos/${fileName}`, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (fileError) {
        console.error('File upload error:', fileError);
        throw new Error('Failed to upload company logo');
      }

      const { data: { publicUrl } } = supabase.storage
        .from("company-logos")
        .getPublicUrl(`logos/${fileName}`);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      throw error;
    }
  }
};