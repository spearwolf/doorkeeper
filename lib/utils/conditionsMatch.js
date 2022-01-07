export default (data, conditions) =>
  conditions == null ||
  Object.entries(conditions).every(([conditionKey, conditionValue]) => {
    const conditionValueIsArray = Array.isArray(conditionValue);

    const dataValue = data[conditionKey];
    const dataValueIsArray = Array.isArray(dataValue);

    if (!conditionValueIsArray && !dataValueIsArray) {
      return conditionValue === dataValue;
    }

    if (conditionValueIsArray && !dataValueIsArray) {
      return conditionValue.includes(dataValue);
    }

    if (!conditionValueIsArray && dataValueIsArray) {
      return dataValue.includes(conditionValue);
    }

    return Object.entries(conditionValue).every(([, val]) => dataValue.includes(val));
  });
