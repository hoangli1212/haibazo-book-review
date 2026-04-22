import { useEffect, useState } from "react";

export function EditModal({
  title,
  initialValues,
  fields,
  onCancel,
  onSubmit,
}) {
  const [values, setValues] = useState(initialValues);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setValues(initialValues);
  }, [initialValues]);

  const setField = (name, value) => {
    setValues((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const hasError = (field) => {
    if (!submitted || !field.required) {
      return false;
    }

    return !String(values[field.name] ?? "").trim();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    const invalid = fields.some((field) => {
      return field.required && !String(values[field.name] ?? "").trim();
    });

    if (invalid) {
      return;
    }

    onSubmit(values);
  };

  return (
    <div className="modal-backdrop">
      <form className="modal" onSubmit={handleSubmit}>
        <h2>{title}</h2>

        <div className="form">
          {fields.map((field) => (
            <div className="form-row" key={field.name}>
              <label htmlFor={field.name}>{field.label}</label>

              {field.type === "select" ? (
                <select
                  id={field.name}
                  value={values[field.name] ?? ""}
                  onChange={(event) => setField(field.name, event.target.value)}
                >
                  <option value="">{field.placeholder}</option>
                  {field.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : field.type === "textarea" ? (
                <textarea
                  id={field.name}
                  value={values[field.name] ?? ""}
                  onChange={(event) => setField(field.name, event.target.value)}
                />
              ) : (
                <input
                  id={field.name}
                  value={values[field.name] ?? ""}
                  onChange={(event) => setField(field.name, event.target.value)}
                />
              )}

              {hasError(field) && (
                <span className="error-text">{field.errorMessage}</span>
              )}
            </div>
          ))}
        </div>

        <div className="modal-actions">
          <button className="secondary-button" onClick={onCancel} type="button">
            Cancel
          </button>
          <button className="primary-button" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
