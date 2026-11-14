# PostHog AI Observability setup

## Outcome

AI Observability is **not yet instrumentable in this project** because the application makes no real LLM or vendor-SDK request.

The installed workflow was `ai-observability-manual-capture`, selected because the Node/Vite manifest has no LLM provider or agent-framework dependency. I did not add synthetic `$ai_generation` events: the only AI-labelled UI action, **“Przygotuj opis z AI”** in `src/features/prototype/employer.tsx`, deterministically constructs text in the browser and does not call an LLM. Reporting it as a generation would create misleading AI Observability data.

## Changes made

- Kept the existing browser PostHog initialization, identity handling, product-event capture, and dashboards unchanged.
- Confirmed the existing client configuration uses `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`; both are configured in `.env`.
- Kept the existing `.posthog-wizard-cache/.posthog-ai.json` manual-capture run record, which notes that there is currently no LLM capture helper.
- Did not add an SDK package or a capture helper. `posthog-js` and `@posthog/react` are already installed, but this browser-only prototype has no model-call runtime to capture.

## What is required to finish instrumentation

Add a real LLM request path, normally on a server, and capture one `$ai_generation` event after every model response using the manual-capture contract. Include the provider, model, input/output token counts, latency, and a shared `$ai_trace_id` for all calls in one request. For multi-turn conversations, use one stable `$ai_session_id` across the conversation; never generate it per model call. Use the authenticated application user ID as `distinctId` only when one is available.

When a vendor SDK or agent framework is introduced, rerun the AI Observability workflow and select the provider/framework-specific integration rather than retaining the manual route.

## Verification

- Confirmed `src/main.tsx` reads the existing PostHog environment variables and initializes the browser SDK.
- Confirmed both required PostHog environment variables are present in `.env` without exposing their values.
- Confirmed the AI-labelled proposal action is local, synchronous string construction with no network or model call.
- Attempted `npm run build`, but the execution environment has no usable Bash installation, so the build did not start. No build or runtime success is claimed.

After a real LLM path is added, trigger two turns in the same conversation and inspect **AI Observability → Traces**. The expected outcome is one AI session containing two traces, with every generation from a turn grouped under that turn’s trace. Tool spans should appear only if the LLM path executes tools.

## Privacy mode

No AI input or output is currently captured, so there is no active AI privacy-mode setting.

For future manual capture, prompt and completion text are captured only when the implementation explicitly includes `$ai_input` and `$ai_output_choices` in the event. Before sending sensitive content, omit those properties and other sensitive custom payloads from the manually captured event. This prevents new prompt/completion content from being sent, but does not remove previously ingested events. See [AI Observability privacy mode](https://posthog.com/docs/ai-observability/privacy-mode).