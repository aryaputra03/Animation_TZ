import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Daftarkan plugin SEKALI saja.
gsap.registerPlugin(ScrollTrigger);

// Bilah alamat Chrome Android yang mengecil tidak boleh memicu refresh terus-menerus.
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };
