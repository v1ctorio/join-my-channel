export default {
    channel_id: 'C07JTBZ66HF', // Target channel ID where members will be added after approved
    header: 'Join the Vic channel',
    body: 'Hi hello hi how you doing hi hello it is me hi.',
    confirmationMessage: "You might join the channel", //set to empty string or false to disable
    approvalMessage: {
        channel: "U072PTA5BNG", // Reviewer Slack user ID or channel ID where to send approval message
        text: "{mention} wants to join your channel.", // VARS: {mention}, {username},
        approveButtonCaption: "Sure",
        deleteButtonCaption: "Delete"
    }
} 