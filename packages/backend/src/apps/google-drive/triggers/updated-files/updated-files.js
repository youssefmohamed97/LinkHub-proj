const updatedFiles = async ($) => {
  let q = `mimeType!='application/vnd.google-apps.folder'`;
  if ($.step.parameters.includeDeleted === false) {
    q += ` and trashed=${$.step.parameters.includeDeleted}`;
  }

  if ($.step.parameters.folderId) {
    q += ` and '${$.step.parameters.folderId}' in parents`;
  } else {
    q += ` and parents in 'root'`;
  }

  const params = {
    pageToken: undefined,
    orderBy: 'modifiedTime desc',
    fields: '*',
    pageSize: 1000,
    q,
    driveId: $.step.parameters.driveId,
    supportsAllDrives: true,
  };

  if ($.step.parameters.driveId) {
    params.includeItemsFromAllDrives = true;
    params.corpora = 'drive';
  }

  do {
    const { data } = await $.http.get(`/v3/files`, { params });
    params.pageToken = data.nextPageToken;

    if (data.files?.length) {
      for (const file of data.files) {
        $.pushTriggerItem({
          raw: file,
          meta: {
            internalId: `${file.id}-${file.modifiedTime}`,
          },
        });
      }
    }
  } while (params.pageToken);
};

export default updatedFiles;
