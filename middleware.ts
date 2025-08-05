import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

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

function handleRedirects(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const redirect = redirects.find((r) => r.from === path);

  if (redirect) {
    return NextResponse.redirect(new URL(redirect.to, request.url));
  }

  return NextResponse.next();
}

export default withAuth(
  function middleware(request: NextRequest) {
    return handleRedirects(request);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (path.startsWith("/admin") && path !== "/admin/login") {
          return token != null;
        }
        return true;
      },
    },
    pages: {
      signIn: "/admin/login",
    },
  }
);

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|admin/login).*)"],
};
