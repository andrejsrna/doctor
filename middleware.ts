import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const redirects = [
    { from: "/x3a-go", to: "/music/x3a-go" },
    { from: "/yehor-hold-me-ep", to: "/music/yehor-hold-me-ep" },
    { from: "/warp-fa2e-bubble-gun-ep", to: "/music/warp-fa2e-bubble-gun-ep" },
    {
      from: "/warp-fa2e-bubble-gun-asana-remix",
      to: "/music/warp-fa2e-bubble-gun-asana-remix",
    },
    { from: "/yehor-never-ep", to: "/music/yehor-never-ep" },
    { from: "/asana-from-the-deeps", to: "/music/asana-from-the-deeps" },
    { from: "/raido-alien-dub-ep", to: "/music/raido-alien-dub-ep" },
    { from: "/yehor-dollar-game-ep", to: "/music/yehor-dollar-game-ep" },
    {
      from: "/asana-ft-yehor-ratatata",
      to: "/music/asana-ft-yehor-ratatata",
    },
    { from: "/asana-raketa-lp", to: "/music/asana-raketa-lp" },
    { from: "/sollist-distractor", to: "/music/sollist-distractor" },
    { from: "/yehor-freaky-ep", to: "/music/yehor-freaky-ep" },
    {
      from: "/asana-neurofunk-symphony",
      to: "/music/asana-neurofunk-symphony",
    },
    { from: "/?p=270", to: "/music" },
    {
      from: "/asana-i-just-wanna-neurofuck",
      to: "/music/asana-i-just-wanna-neurofuck",
    },
    { from: "/asana-neuro-stomper", to: "/music/asana-neuro-stomper" },
    { from: "/saintxavio-zirah", to: "/music/saintxavio-zirah" },
    {
      from: "/vecster-feat-brain-wave-badman",
      to: "/music/vecster-feat-brain-wave-badman",
    },
    { from: "/emzee-deja-vu", to: "/music/emzee-deja-vu" },
    { from: "/yehor-gunshot-ep", to: "/music/yehor-gunshot-ep" },
    { from: "/asana-raketa-lp", to: "/music/asana-raketa-lp" },
    { from: "/hotbox-ep", to: "/music/hotbox-ep" },
    { from: "/emzee-tormentum-ep", to: "/music/emzee-tormentum-ep" },
    { from: "/profuze-the-aspects-ep", to: "/music/profuze-the-aspects-ep" },
    { from: "/xsonsence-sins-sandworm", to: "/music/xsonsence-sins-sandworm" },
    { from: "/arax-enif-of-course", to: "/music/arax-enif-of-course" },
    { from: "/durability-shindeiru", to: "/music/durability-shindeiru" },
    { from: "/emzee-mc-sk3ngz-collide", to: "/music/emzee-mc-sk3ngz-collide" },
    { from: "/asana-the-comet", to: "/music/asana-the-comet" },
    { from: "/zorro-swerve", to: "/music/zorro-swerve" },
    { from: "/neurotikum-grip", to: "/music/neurotikum-grip" },
    {
      from: "/ideatorz-stick-to-the-musich",
      to: "/music/ideatorz-stick-to-the-musich",
    },
    {
      from: "/asana-this-land-will-burn",
      to: "/music/asana-this-land-will-burn",
    },
    { from: "/led-xerxes", to: "/music/led-xerxes" },
    { from: "/ill-fated-follow-me", to: "/music/ill-fated-follow-me" },
    {
      from: "/syncord-sins-marvel-laboratory",
      to: "/music/syncord-sins-marvel-laboratory",
    },
    { from: "/asana-mosquito", to: "/music/asana-mosquito" },
    { from: "/led-lost-fighters", to: "/music/led-lost-fighters" },
    {
      from: "/emzee-dirigentes-unknown-remix",
      to: "/music/emzee-dirigentes-unknown-remix",
    },
    { from: "/yehor-move-vip", to: "/music/yehor-move-vip" },
    { from: "/monolith-extasy", to: "/music/monolith-extasy" },
    { from: "/asana-neurogasm", to: "/music/asana-neurogasm" },
    { from: "/richart-void", to: "/music/richart-void" },
    {
      from: "/ill-fated-noble-sacrifice",
      to: "/music/ill-fated-noble-sacrifice",
    },
    { from: "/emzee-darkness", to: "/music/emzee-darkness" },
    { from: "/defracture-calculator", to: "/music/defracture-calculator" },
    { from: "/asana-zapiname-pasy", to: "/music/asana-zapiname-pasy" },
    {
      from: "/richart-franshrek-black-cough",
      to: "/music/richart-franshrek-black-cough",
    },
    { from: "/max-shade-kick-bass", to: "/music/max-shade-kick-bass" },
    { from: "/xsonsence-connected", to: "/music/xsonsence-connected" },
    {
      from: "/asana-neurogasm-warp-fa2e-remix",
      to: "/music/asana-neurogasm-warp-fa2e-remix",
    },
    { from: "/asana-ritmo-y-pasion", to: "/music/asana-ritmo-y-pasion" },
    { from: "/xsonsence-entire", to: "/music/xsonsence-entire" },
    { from: "/richart-suffering", to: "/music/richart-suffering" },
    { from: "/sscape-alkaline", to: "/music/sscape-alkaline" },
    { from: "/yehor-lose-control", to: "/music/yehor-lose-control" },
    {
      from: "/chemical-chronicles-2024",
      to: "/music/chemical-chronicles-2024",
    },
    { from: "/asana-neurofunk-code", to: "/music/asana-neurofunk-code" },
    { from: "/podcasts", to: "/music" },
  ];
  
  const PUBLIC_PATHS = [
    "/",
    "/music",
    "/news",
    "/about",
    "/contact",
    "/submit-demo",
    "/newsletter",
    "/privacy-policy",
    "/terms",
    "/bio",
    "/guidelines",
    "/sample-packs",
    "/music-packs",
    "/neurofunk-drum-and-bass",
    "/bulk-sale",
    "/search",
    "/unsub",
    "/demo-feedback",
  ];
  
  const STATIC_ASSETS = [
    "/favicon.ico",
    "/robots.txt",
    "/sitemap.xml",
    "/sitemap-0.xml",
  ];
  
  function isPublicPath(path: string): boolean {
    return PUBLIC_PATHS.some(publicPath => 
      path === publicPath || path.startsWith(publicPath + "/")
    );
  }
  
  function isStaticAsset(path: string): boolean {
    return STATIC_ASSETS.some(asset => path === asset);
  }
  
  function isApiPath(path: string): boolean {
    return path.startsWith("/api/");
  }
  
  function normalizePath(path: string): string {
    const lower = path.toLowerCase();
    if (lower !== "/" && lower.endsWith("/")) {
      return lower.slice(0, -1);
    }
    return lower;
  }

  function handleRedirects(request: NextRequest): NextResponse | null {
    try {
      const originalPath = request.nextUrl.pathname;
      const path = normalizePath(originalPath);
      const redirect = redirects.find((r) => normalizePath(r.from) === path);

      if (redirect) {
        const response = NextResponse.redirect(new URL(redirect.to, request.url));
        if (process.env.DEBUG_MIDDLEWARE_REDIRECTS === "1") {
          console.info("Middleware redirect:", originalPath, "->", redirect.to);
        }
        return response;
      }
      return null;
    } catch (error) {
      console.error("Redirect error:", error);
      return null;
    }
  }
  
  function addSecurityHeaders(response: NextResponse): NextResponse {
    try {
      response.headers.set("X-Frame-Options", "DENY");
      response.headers.set("X-Content-Type-Options", "nosniff");
      response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
      response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
      
      if (process.env.NODE_ENV === "production") {
        response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
      }
      
      return response;
    } catch (error) {
      console.error("Security headers error:", error);
      return response;
    }
  }

  function addCacheControlHeaders(response: NextResponse, path: string): NextResponse {
    try {
      // Disable caching for admin routes and auth
      if (path.startsWith("/admin") || path.startsWith("/api/admin") || path.startsWith("/api/auth")) {
        response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate, max-age=0");
        response.headers.set("Pragma", "no-cache");
        response.headers.set("Expires", "0");
      } else if (path.startsWith("/_next/static") || path.startsWith("/_next/image") || path.startsWith("/public") || path.match(/\.(?:js|css|svg|png|jpg|jpeg|gif|webp|ico)$/)) {
        // Static assets: long-term immutable caching
        response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
      } else if (path.startsWith("/api/")) {
        // Public API: allow shared cache with SWR
        response.headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=86400");
      } else {
        // HTML routes: let Next control caching or use short TTL
        response.headers.set("Cache-Control", "public, s-maxage=0, must-revalidate");
      }
      
      return response;
    } catch (error) {
      console.error("Cache control headers error:", error);
      return response;
    }
  }
  
  export default function middleware(request: NextRequest) {
    try {
      const path = request.nextUrl.pathname;
      
      if (isStaticAsset(path) || isApiPath(path)) {
        const response = NextResponse.next();
        return addCacheControlHeaders(addSecurityHeaders(response), path);
      }
      
      const redirectResponse = handleRedirects(request);
      if (redirectResponse) {
        return addCacheControlHeaders(addSecurityHeaders(redirectResponse), path);
      }
      
      if (isPublicPath(path)) {
        const response = NextResponse.next();
        return addCacheControlHeaders(addSecurityHeaders(response), path);
      }
      
      if (path.startsWith("/admin")) {
        const sessionCookie = getSessionCookie(request);
        const isAuthed = Boolean(sessionCookie);
        if (!isAuthed && path !== "/admin/login") {
          const redirectResponse = NextResponse.redirect(new URL("/admin/login", request.url));
          return addCacheControlHeaders(addSecurityHeaders(redirectResponse), path);
        }
        if (isAuthed && path === "/admin/login") {
          const redirectResponse = NextResponse.redirect(new URL("/admin", request.url));
          return addCacheControlHeaders(addSecurityHeaders(redirectResponse), path);
        }
        const response = NextResponse.next();
        return addCacheControlHeaders(addSecurityHeaders(response), path);
      }
      
      const response = NextResponse.next();
      return addCacheControlHeaders(addSecurityHeaders(response), path);
      
    } catch (error) {
      console.error("Middleware error:", error);
      const response = NextResponse.next();
      return addCacheControlHeaders(addSecurityHeaders(response), request.nextUrl.pathname);
    }
  }
  
  export const config = {
    matcher: [
      "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
  };