function DeleteModal({ fileName }: { fileName: string }) {
  return (
    <p className="delete-confirmation">
      Are you sure you want to delete this file?
      <span className="delete-file-name">{fileName}</span>
    </p>
  );
}

export default DeleteModal;
