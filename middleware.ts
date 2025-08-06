import { NextRequest, NextResponse } from "next/server";

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

function handleRedirects(request: NextRequest): NextResponse | null {
  try {
    const path = request.nextUrl.pathname;
    const redirect = redirects.find((r) => r.from === path);

    if (redirect) {
      return NextResponse.redirect(new URL(redirect.to, request.url));
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

function checkAdminAuth(request: NextRequest): NextResponse | null {
  try {
    const path = request.nextUrl.pathname;
    
    if (path.startsWith("/admin") && path !== "/admin/login") {
      const token = request.cookies.get("next-auth.session-token") || 
                   request.cookies.get("__Secure-next-auth.session-token");
      
      if (!token) {
        return NextResponse.redirect(new URL("/admin/login", request.url));
      }
    }
    return null;
  } catch (error) {
    console.error("Admin auth error:", error);
    return null;
  }
}

export default function middleware(request: NextRequest) {
  try {
    const path = request.nextUrl.pathname;
    
    if (isStaticAsset(path)) {
      return NextResponse.next();
    }
    
    if (isApiPath(path)) {
      const response = NextResponse.next();
      return addSecurityHeaders(response);
    }
    
    const redirectResponse = handleRedirects(request);
    if (redirectResponse) {
      return addSecurityHeaders(redirectResponse);
    }
    
    if (isPublicPath(path)) {
      const response = NextResponse.next();
      return addSecurityHeaders(response);
    }
    
    const adminAuthResponse = checkAdminAuth(request);
    if (adminAuthResponse) {
      return addSecurityHeaders(adminAuthResponse);
    }
    
    const response = NextResponse.next();
    return addSecurityHeaders(response);
    
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
