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
  },

  async uploadResume(file) {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('resumes')
        .upload(`applications/${fileName}`, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('resumes')
        .getPublicUrl(`applications/${fileName}`);

      return publicUrl;
    } catch (error) {
      console.error('Resume upload error:', error);
      throw new Error('Failed to upload resume');
    }
  }
};