'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '../../components/ProtectedRoute';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search, 
  FileText,
  Save,
  X,
  Upload,
  File
} from 'lucide-react';
import { toast } from 'react-toastify';

export default function AdminTemplate() {
  const [templates, setTemplates] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadForm, setUploadForm] = useState({
    kategori: '',
    deskripsi: ''
  });
  const [formData, setFormData] = useState({
    judul: '',
    kategori: '',
    deskripsi: '',
    content: ''
  });

  const categories = [
    'Izin Kegiatan',
    'Rekomendasi', 
    'Proposal',
    'Undangan',
    'Laporan',
    'Permohonan',
    'Keterangan'
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/template');
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
      } else {
        console.error('Failed to load templates');
        toast.error('Gagal memuat template');
      }
    } catch (error) {
      console.error('Error loading templates:', error);
      toast.error('Terjadi kesalahan saat memuat template');
    }
  };

  const saveTemplates = async (templatesData) => {
    // This function is no longer needed as we save directly to database
    // Keep for compatibility but will be replaced by direct API calls
  };

  const handleAddNew = () => {
    setEditingTemplate(null);
    setFormData({
      judul: '',
      kategori: '',
      deskripsi: '',
      content: ''
    });
    setShowModal(true);
  };

  const handleUpload = () => {
    setUploadFile(null);
    setUploadForm({
      kategori: '',
      deskripsi: ''
    });
    setShowUploadModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validasi file
      const allowedTypes = [
        'text/plain', 
        'application/msword', 
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/rtf'
      ];
      
      if (!allowedTypes.includes(file.type)) {
        toast.error('Format file tidak didukung. Gunakan .txt, .doc, .docx, atau .rtf');
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Ukuran file terlalu besar. Maksimal 5MB');
        return;
      }

      setUploadFile(file);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    
    if (!uploadFile || !uploadForm.kategori || !uploadForm.deskripsi) {
      toast.error('Semua field harus diisi');
      return;
    }

    try {
      const reader = new FileReader();
      
      // Change to readAsArrayBuffer to get binary data for any file type
      reader.readAsArrayBuffer(uploadFile);
      
      reader.onload = async (event) => {
        // Convert ArrayBuffer to base64 string for storage
        const arrayBuffer = event.target.result;
        const bytes = new Uint8Array(arrayBuffer);
        let binary = '';
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const fileContent = btoa(binary);
        
        const templateData = {
          judul: uploadFile.name.replace(/\.[^/.]+$/, ""), // Remove file extension
          kategori: uploadForm.kategori,
          deskripsi: uploadForm.deskripsi,
          fileName: uploadFile.name,
          filePath: `uploads/${uploadFile.name}`,
          fileSize: Math.round(uploadFile.size / 1024) + ' KB',
          fileContent: fileContent // Store the binary content as base64
        };

        // Save to database via API
        const response = await fetch('/api/template', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(templateData)
        });

        if (response.ok) {
          toast.success('File berhasil diupload sebagai template');
          setShowUploadModal(false);
          loadTemplates(); // Reload templates from database
        } else {
          const error = await response.json();
          toast.error(error.error || 'Gagal menyimpan template');
        }
      };

      // Note: We moved the readAsArrayBuffer call before the onload handler
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Terjadi kesalahan saat mengupload file');
    }
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData({
      judul: template.judul,
      kategori: template.kategori,
      deskripsi: template.deskripsi,
      content: template.content || `Template: ${template.judul}
      
Kategori: ${template.kategori}
Deskripsi: ${template.deskripsi}

[Konten template - silakan edit sesuai kebutuhan]

--- Template MAPALA ---
Dibuat: ${new Date(template.createdAt).toLocaleDateString('id-ID')}
Update: ${new Date(template.updatedAt).toLocaleDateString('id-ID')}`
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus template ini?')) {
      try {
        const response = await fetch(`/api/template/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          toast.success('Template berhasil dihapus');
          loadTemplates(); // Reload templates from database
        } else {
          const error = await response.json();
          toast.error(error.error || 'Gagal menghapus template');
        }
      } catch (error) {
        console.error('Error deleting template:', error);
        toast.error('Terjadi kesalahan saat menghapus template');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.judul || !formData.kategori || !formData.deskripsi || !formData.content) {
      toast.error('Semua field harus diisi');
      return;
    }

    try {
      const templateData = {
        judul: formData.judul,
        kategori: formData.kategori,
        deskripsi: formData.deskripsi,
        fileName: `${formData.judul.replace(/[^a-zA-Z0-9]/g, '_')}.txt`,
        filePath: `templates/${formData.judul.replace(/[^a-zA-Z0-9]/g, '_')}.txt`,
        fileSize: Math.round(formData.content.length / 1024) + ' KB'
      };

      let response;
      if (editingTemplate) {
        // Update existing template
        response = await fetch(`/api/template/${editingTemplate.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(templateData)
        });
      } else {
        // Add new template
        response = await fetch('/api/template', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(templateData)
        });
      }

      if (response.ok) {
        toast.success(editingTemplate ? 'Template berhasil diperbarui' : 'Template berhasil ditambahkan');
        setShowModal(false);
        loadTemplates(); // Reload templates from database
      } else {
        const error = await response.json();
        toast.error(error.error || 'Gagal menyimpan template');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Terjadi kesalahan saat menyimpan template');
    }
  };

  const filteredTemplates = templates.filter(template => 
    template.judul.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.deskripsi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Kelola Template</h1>
                <p className="text-gray-600">Manage template surat MAPALA</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleUpload}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload File
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Cari template..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map(template => (
              <div key={template.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      {template.judul}
                      {template.isUploaded && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          Uploaded
                        </span>
                      )}
                    </h3>
                    <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                      {template.kategori}
                    </span>
                  </div>
                  <FileText className="h-8 w-8 text-purple-600" />
                </div>

                <p className="text-gray-600 text-sm mb-4">
                  {template.deskripsi}
                </p>

                <div className="space-y-2 text-sm text-gray-500 mb-6">
                  <div>Update: {new Date(template.updatedAt).toLocaleDateString('id-ID')}</div>
                  <div>{template.downloadCount} downloads • {template.fileSize}</div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(template)}
                    className="flex-1 bg-blue-100 text-blue-700 py-2 px-4 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="flex-1 bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Tidak ada template yang ditemukan
              </h3>
              <p className="text-gray-600">
                Coba ubah kata kunci pencarian atau tambah template baru
              </p>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-10 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {editingTemplate ? 'Edit Template' : 'Tambah Template Baru'}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Judul Template *
                      </label>
                      <input
                        type="text"
                        value={formData.judul}
                        onChange={(e) => setFormData({...formData, judul: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Masukkan judul template"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kategori *
                      </label>
                      <select
                        value={formData.kategori}
                        onChange={(e) => setFormData({...formData, kategori: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        required
                      >
                        <option value="">Pilih kategori</option>
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi *
                    </label>
                    <textarea
                      value={formData.deskripsi}
                      onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Masukkan deskripsi template"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Konten Template *
                    </label>
                    <textarea
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      rows={15}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-mono text-sm"
                      placeholder="Masukkan konten template surat..."
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Gunakan [Field] untuk placeholder yang dapat diisi pengguna
                    </p>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {editingTemplate ? 'Update' : 'Simpan'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    Upload Template File
                  </h3>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <form onSubmit={handleUploadSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pilih File Template *
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <File className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                            <span>Upload file</span>
                            <input 
                              id="file-upload" 
                              name="file-upload" 
                              type="file" 
                              className="sr-only"
                              accept=".txt,.doc,.docx,.rtf"
                              onChange={handleFileChange}
                              required
                            />
                          </label>
                          <p className="pl-1">atau drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">
                          TXT, DOC, DOCX, RTF up to 5MB
                        </p>
                        {uploadFile && (
                          <div className="mt-2 text-sm text-green-600">
                            ✓ {uploadFile.name} ({(uploadFile.size / 1024).toFixed(2)} KB)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Kategori *
                    </label>
                    <select
                      value={uploadForm.kategori}
                      onChange={(e) => setUploadForm({...uploadForm, kategori: e.target.value})}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Pilih kategori</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deskripsi *
                    </label>
                    <textarea
                      value={uploadForm.deskripsi}
                      onChange={(e) => setUploadForm({...uploadForm, deskripsi: e.target.value})}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Masukkan deskripsi template yang diupload"
                      required
                    />
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">
                          Catatan Upload
                        </h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            • File akan dikonversi menjadi template teks<br/>
                            • Untuk file Word (.doc/.docx), konten akan diextract secara sederhana<br/>
                            • Anda dapat mengedit konten setelah upload<br/>
                            • File maksimal 5MB
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowUploadModal(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload Template
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
