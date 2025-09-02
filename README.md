# 🖼️ Image to Lottie Converter

Transform your static images into **Lottie animation files**.  
Upload an image and get a downloadable **JSON file** ready for your animations.

---

## 🚀 Features
- Upload any image (PNG, JPG, etc.)
- Generate a **Lottie JSON** file with your image embedded
- Automatic dimension handling
- **Base64 encoded image data** for portability
- Ready-to-use in **Lottie animations**

---

## 📖 How It Works
1. **Upload Image**  
   - Drag and drop your image into the upload area  
   - Or click to browse and select an image file  

2. **Generate Lottie**  
   - Once uploaded, the tool generates a Lottie JSON file  
   - Your image is embedded as a static animation layer  

3. **Download JSON**  
   - Click **Download Lottie JSON** to get your file  
   - Import into your projects with [Lottie](https://airbnb.io/lottie/)

---

## 🛠️ Example Workflow
```bash
# 1. Upload your image
# 2. Download the generated JSON
# 3. Use it in your web or mobile project

# Example (React with lottie-react):
import Lottie from "lottie-react";
import animationData from "./my-image.json";

<Lottie animationData={animationData} loop={true} />
```

---

## 📦 Output
- A `.json` file containing:
  - ✅ Embedded image (Base64)
  - ✅ Proper dimensions
  - ✅ Lottie-compatible structure

---

## 🌐 Live Demo
👉 [Image to Lottie Converter](https://your-live-link-here.com)

---

## 👨‍💻 Developed By
[Binuka Kamesh](https://github.com/binukakamesh)
