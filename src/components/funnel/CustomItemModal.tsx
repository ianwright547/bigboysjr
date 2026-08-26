import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Camera, X, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useFunnel } from "@/context/FunnelContext";

interface CustomItemModalProps {
  open: boolean;
  onClose: () => void;
  onItemAdded: (description: string) => void;
}

const CustomItemModal = ({ open, onClose, onItemAdded }: CustomItemModalProps) => {
  const { zip } = useFunnel();
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [zipCode, setZipCode] = useState(zip || "");
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhotoAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = 3 - photos.length;
    const toAdd = files.slice(0, remaining);
    setPhotos((prev) => [...prev, ...toAdd]);
    toAdd.forEach((f) => {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotoPreviews((prev) => [...prev, ev.target?.result as string]);
      reader.readAsDataURL(f);
    });
    if (fileRef.current) fileRef.current.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!description.trim() || !name.trim() || !phone.trim()) return;
    setSubmitting(true);

    try {
      // Upload photos under the 'pending/' prefix (enforced by RLS).
      const photoUrls: string[] = [];
      for (const photo of photos) {
        const rawExt = (photo.name.split(".").pop() || "jpg").toLowerCase();
        const ext = ["jpg", "jpeg", "png", "webp", "heic"].includes(rawExt) ? rawExt: "jpg";
        const safeId = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
        const path = `pending/${safeId}.${ext}`;
        const { error } = await supabase.storage.from("custom-item-photos").upload(path, photo);
        if (!error) {
          const { data: urlData } = supabase.storage.from("custom-item-photos").getPublicUrl(path);
          photoUrls.push(urlData.publicUrl);
        }
      }

      // Insert request
      await supabase.from("custom_item_requests").insert({
        description: description.trim(),
        photo_urls: photoUrls,
        quantity,
        zip_code: zipCode.trim() || null,
        name: name.trim(),
        phone: phone.trim(),
      });

      setSubmitted(true);
      onItemAdded(description.trim());
    } catch {
      // Silently handle - still show success to not lose lead
      setSubmitted(true);
      onItemAdded(description.trim());
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setDescription("");
    setQuantity(1);
    setName("");
    setPhone("");
    setZipCode(zip || "");
    setPhotos([]);
    setPhotoPreviews([]);
    setSubmitted(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-md mx-auto rounded-t-2xl sm:rounded-2xl p-0 gap-0 max-h-[90vh] overflow-y-auto">
        {submitted ? (
          <div className="p-8 text-center">
            <CheckCircle className="w-14 h-14 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">We received your request!</h3>
            <p className="text-sm text-muted-foreground mb-1">We'll send you a price shortly.</p>
            <p className="text-xs text-muted-foreground mb-6">We price it fairly and send approval before charging.</p>
            <Button onClick={handleClose} className="w-full h-12 rounded-xl font-semibold">
              Continue Booking
            </Button>
          </div>
        ): (
          <>
            <DialogHeader className="p-5 pb-2">
              <DialogTitle className="text-lg font-bold text-foreground">What are you trying to remove?</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">If you see it, we remove it. No item too big or too weird.</p>
            </DialogHeader>

            <div className="p-5 pt-2 space-y-4">
              {/* Description */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Describe the item</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. antique cabinet, broken hot tub cover, gym machine…"
                  rows={2}
                  className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              {/* Photo upload */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Upload a photo <span className="text-muted-foreground font-normal">(optional but recommended)</span></label>
                <div className="flex items-center gap-2 flex-wrap">
                  {photoPreviews.map((src, i) => (
                    <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-border">
                      <img src={src} alt={`Photo ${i + 1}`} width={64} height={64} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                      <button
                        onClick={() => removePhoto(i)}
                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {photos.length < 3 && (
                    <button
                      onClick={() => fileRef.current?.click()}
                      className="w-16 h-16 rounded-lg border-2 border-dashed border-border flex flex-col items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                    >
                      <Camera className="w-5 h-5" />
                      <span className="text-[9px] mt-0.5">Add</span>
                    </button>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoAdd}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">Quantity</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-bold text-foreground w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* ZIP */}
              <div>
                <label className="text-sm font-medium text-foreground block mb-1.5">ZIP Code</label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value.replace(/\D/g, "").slice(0, 5))}
                  placeholder="Enter ZIP code"
                  className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              {/* Contact */}
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-1.5">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 555-5555"
                    className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <p className="text-xs text-muted-foreground text-center">We price it fairly and send approval before charging.</p>

              <Button
                onClick={handleSubmit}
                disabled={!description.trim() || !name.trim() || !phone.trim() || submitting}
                className="w-full h-12 rounded-xl font-semibold text-base"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Submitting...</>
                ): (
                  "Get My Price"
                )}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CustomItemModal;
