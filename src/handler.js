const { nanoid } = require("nanoid");
const notes = require("./notes");

const addNoteHandler = (request, h) => {
  // Menyimpan note dari web
  // Buat variabel untuk menyimpan data dari request client
  const { title, tags, body } = request.payload;
  // Dikarenakan terdapat data selain 3 diatas yang didapat dari client, kita harus membuat sisanya
  const id = nanoid(16); // 16 merupakan ukuran stringnya
  const createdAt = new Date().toISOString(); // tanggal notes dibuat oleh client
  const updatedAt = createdAt; // tanggal notes diupdate oleh client

  const newNote = {
    title,
    tags,
    body,
    id,
    createdAt,
    updatedAt,
  };
  // Tambah data ke variabel note di file note
  notes.push(newNote);
  //console.log(`Data dari frontend ${notes}`);

  // Buat variabel untuk menentukan apakah notes berhasil ditambahkan atau tidak
  const isSuccess = notes.filter((note) => note.id === id).length > 0;

  // Buat kondisi di atas
  if (isSuccess) {
    const response = h.response({
      status: "success",
      message: "Catatan berhasil ditambahkan",
      data: {
        noteId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: "Catatan gagal ditambahkan",
  });
  response.code(500);
  return response;
};

// Menampilkan data yang sudah disimpan di server
const getAllNotesHandler = () => ({
  status: "success",
  data: {
    notes,
  },
});

// Menampilkan data pada note yang spesific
const getNoteByIdHandler = (request, h) => {
  const { id } = request.params;
  // Dapatkan notes dengan id tersebut
  const note = notes.filter((n) => n.id === id)[0];

  if (note !== undefined) {
    return {
      tatus: "success",
      data: {
        note,
      },
    };
  }

  const response = h.response({
    status: "fail",
    message: "Catatan tidak ditemukan",
  });
  response.code(404);
  return response;
};

// Mengedit note yang sudah dibuat sebelumnya
const editNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const { title, tags, body } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = notes.findIndex((note) => note.id === id);

  if (index !== -1) {
    notes[index] = {
      ...notes[index],
      title,
      tags,
      body,
      updatedAt,
    };

    const response = h.response({
      status: "success",
      message: "Catatan berhasil diperbarui",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    message: " Gagal memperbarui catatan, Id tidak ditemukan",
  });
  response.code(400);
  return response;
};

// Menghapus note yang sudah dibuat
const deleteNoteByIdHandler = (request, h) => {
  const { id } = request.params;

  const index = notes.findIndex((note) => note.id === id);
  if (index !== -1) {
    notes.splice(index, 1);
    const response = h.response({
      status: "success",
      message: "Catatan berhasil dihapus",
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: "fail",
    messagae: "Catatan gagal dihapus, id tidak ditemukan",
  });
  response.code(404);
  return response;
};

module.exports = {
  addNoteHandler,
  getAllNotesHandler,
  getNoteByIdHandler,
  editNoteByIdHandler,
  deleteNoteByIdHandler,
};
