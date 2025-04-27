import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const AddLogementDialog = ({ open, setOpen, formData, handleChange, handleAddLogement }) => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>Ajouter un logement</DialogTitle>
      <DialogContent>
        <TextField label="Titre" name="titre" fullWidth margin="dense" value={formData.titre} onChange={handleChange} />
        <TextField label="Description" name="description" fullWidth margin="dense" value={formData.description} onChange={handleChange} />
        <TextField label="Prix par nuit" name="prixParNuit" type="number" fullWidth margin="dense" value={formData.prixParNuit} onChange={handleChange} />
        <TextField label="Ville" name="ville" fullWidth margin="dense" value={formData.ville} onChange={handleChange} />
        <TextField label="Pays" name="pays" fullWidth margin="dense" value={formData.pays} onChange={handleChange} />
        <TextField label="Image URL" name="image" fullWidth margin="dense" value={formData.image} onChange={handleChange} />
        <TextField label="Date d'arrivée" name="dateArrivee" type="date" fullWidth margin="dense" value={formData.dateArrivee} onChange={handleChange} InputLabelProps={{ shrink: true }} />
        <TextField label="Date de départ" name="dateDepart" type="date" fullWidth margin="dense" value={formData.dateDepart} onChange={handleChange} InputLabelProps={{ shrink: true }} />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)}>Annuler</Button>
        <Button variant="contained" onClick={handleAddLogement}>Ajouter</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddLogementDialog;
