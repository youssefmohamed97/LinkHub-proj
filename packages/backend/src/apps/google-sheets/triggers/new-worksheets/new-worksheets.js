const newWorksheets = async ($) => {
  const params = {
    pageToken: undefined,
  };

  do {
    const { data } = await $.http.get(
      `/v4/spreadsheets/${$.step.parameters.spreadsheetId}`,
      { params }
    );
    params.pageToken = data.nextPageToken;

    if (data.sheets?.length) {
      for (const sheet of data.sheets.reverse()) {
        $.pushTriggerItem({
          raw: sheet,
          meta: {
            internalId: sheet.properties.sheetId.toString(),
          },
        });
      }
    }
  } while (params.pageToken);
};

export default newWorksheets;
