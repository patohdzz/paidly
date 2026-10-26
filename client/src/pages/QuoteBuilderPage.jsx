import { useState } from "react";
import Header from "../components/Header";
import QuoteResult from "../components/QuoteResult";
import { aiApi } from "../api/paidlyApi";
import { QUOTE_MAX, exampleProblems, validateQuoteRequest } from "../utils/quoteUtils";

function QuoteBuilderPage() {
  const [description, setDescription] = useState("");
  const [inputError, setInputError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState(null);
  const [result, setResult] = useState(null);

  function handleChange(e) {
    setDescription(e.target.value);
    if (inputError) {
      setInputError(null);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const error = validateQuoteRequest(description);
    if (error) {
      setInputError(error);
      return;
    }

    setLoading(true);
    setRequestError(null);
    setResult(null);

    try {
      // The server asks the AI, checks its answer, and calculates the prices.
      const quote = await aiApi.quote(description.trim());
      setResult({ ...quote, description: description.trim() });
    } catch (err) {
      setRequestError(
        err.status === 429 || err.status === 0
          ? err.message
          : "We couldn't build an estimate right now. Please try again, or browse our services."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Header title="AI Quote Builder" />

      <div className="row g-4">
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <p className="text-secondary">
                Describe what&apos;s broken in your own words. We&apos;ll match
                it to our services and give you an instant estimate.
              </p>

              <form onSubmit={handleSubmit} noValidate>
                <label htmlFor="quote-description" className="form-label fw-semibold">
                  What needs fixing?
                </label>
                <textarea
                  id="quote-description"
                  rows="5"
                  maxLength={QUOTE_MAX}
                  className={`form-control ${inputError ? "is-invalid" : ""}`}
                  value={description}
                  onChange={handleChange}
                  placeholder="e.g. My kitchen faucet drips and the toilet keeps running."
                  aria-describedby="quote-help"
                  disabled={loading}
                />
                <div className="d-flex justify-content-between">
                  {inputError ? (
                    <div className="invalid-feedback d-block">{inputError}</div>
                  ) : (
                    <span id="quote-help" className="form-text">
                      Don&apos;t include personal info like phone numbers.
                    </span>
                  )}
                  <small className="text-muted text-nowrap ms-2">
                    {description.length}/{QUOTE_MAX}
                  </small>
                </div>

                <div className="mt-3 mb-4">
                  <div className="small text-muted mb-2">Try an example:</div>
                  <div className="d-flex flex-wrap gap-2">
                    {exampleProblems.map((example) => (
                      <button
                        key={example}
                        type="button"
                        className="btn btn-light btn-sm text-start"
                        onClick={() => setDescription(example)}
                        disabled={loading}
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        aria-hidden="true"
                      />
                      Building your estimate...
                    </>
                  ) : (
                    "Get my estimate"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6" aria-live="polite">
          {requestError && (
            <div className="alert alert-danger d-flex justify-content-between align-items-center">
              <span>{requestError}</span>
              <button
                type="button"
                className="btn btn-outline-danger btn-sm ms-3"
                onClick={handleSubmit}
              >
                Retry
              </button>
            </div>
          )}

          {result && (
            <QuoteResult
              summary={result.summary}
              estimate={result.estimate}
              source={result.source}
              disclaimer={result.disclaimer}
              description={result.description}
            />
          )}

          {!result && !requestError && !loading && (
            <div className="card border-0 bg-transparent">
              <div className="card-body p-4 text-center text-secondary">
                Your estimate will appear here.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default QuoteBuilderPage;