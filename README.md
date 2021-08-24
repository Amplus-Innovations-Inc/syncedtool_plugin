# syncedtool_plugin

## Introduction

This plugin assists users in sharing files in bulk on Syncedtool through uploading CSV files.

## How to add extension

1. Click on code and download the ZIP
2. Extract ZIP file in the location you downloaded it to
3. On you browser, go to settings and click extensions `edge://extensions/` on edge and `chrome://extensions` on chrome, make sure developer mode is turned on.
4. On the extensions page, clicked on load unpacked. Then select the folder that you extracted above.

## Usage

On the left side are two buttons used to upload the link and email csv files, respectively. Both files must be uploaded in order for the share button to work.

On the right are options for how the link should be shared.

### Mode Option

Mode options specify how the emails in the email CSV will be shared.

- **Append**: This option will keep the existing recipient list intact and will append any new emails in the email CSV. Note that the permission options of existing recipient will not change.
- **Overwrite**: This option will overwrite the existing recipient list. This means any existing recipients of a share will be replaced by the emails in the email CSV file uploaded. Use this option if users need to removed from share links.

### Notify Options

Notify options specify how recipients will be notified. These options are identical to the options in Syncedtool's existing UI.

- **Notify New**: Selecting this option will send share notificaton emails to any new recipients added to share link.
- **Notify All**: Selecting this option will send share notification emails to everyone including users who are already have access to the link.
- **Notify None**: When this option is selected no one will be notified of the share action.

### Permission Options

Permission options specify what the recipients are allowed to do with the files in the link.

- **Write Access**: This option will allow recipients to modify the files contained in the link.
- **Delete Access**: This option will allow recipients to delete files contained in the link. This only works with links to folders.

The share button and progress bar/feedback area are located on the bottom.

### How to use

1. Use the template csv files included to populate them with link and file information.
2. Upload link csv containing the links to be shared. Upload the email csv containing the emails.
3. Select the sharing options
4. Press **Share**

### Limitations and Best Practices

1. Ensure there are no spaces in cells.
2. Ensure files are saved as CSV UTF-8
3. If 'Error sharing' occurs, either there is no internet, there is an issue with one or more links in the link csv, or you are not logged into the Syncedtool account.
