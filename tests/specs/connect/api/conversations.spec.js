/**
 * This file is part of the Ingram Micro Cloud Blue Connect SDK.
 *
 * @copyright (c) 2020. Ingram Micro. All Rights Reserved.
 */


const ConversationResource = require('../../../../lib/connect/api/conversations');
const { ConnectClient } = require('../../../../index');

describe('ConversationResource', () => {
  let client;

  const contentTypeJson = { 'content-type': 'application/json' };

  beforeAll(() => {
    client = new ConnectClient('https://localhost', '1234567890');
  });
  beforeEach(() => {
    fetch.resetMocks();
  });
  it('returns a list of conversations attached to the business object specified by its id', async () => {
    const conv = new ConversationResource(client);
    const conversations = [
      {
        id: 'CV-001',
        messages: []
      }
    ]
    fetch.mockResponseOnce(JSON.stringify(conversations), { status: 200, headers: contentTypeJson });
    await expect(conv.getConversationsByObjectId('PR-001')).resolves.toEqual(conversations);
    expect(fetch).toBeCalledWith('https://localhost/conversations?instance_id=PR-001', expect.anything());
  });

  it('returns a list of messages of a conversation specified by its id', async () => {
    const conv = new ConversationResource(client);
    const messages = {
      id: "CO-000-000-000",
      messages: [
        {
          id: 'ME-000-000-000',
          conversation: 'CO-000-000-000',
          created: '2018-12-18T13:03:30+00:00',
          creator: {
            id: 'UR-000-000-000',
            name: 'Some User'
          },
          text: 'Hi, check out'
        },
      ],
      creator: {
        id: 'UR-000-000-000',
        name: 'Some User'
      },
    };
  fetch.mockResponseOnce(JSON.stringify(messages), { status: 200, headers: contentTypeJson });
    await expect(conv.messages('PR-001').search()).resolves.toEqual(messages);
    expect(fetch).toBeCalledWith('https://localhost/conversations/PR-001/messages', expect.anything());
  });

  it('append a message to a conversation', async () => {
    const conv = new ConversationResource(client);
    const obj = {id: 'ME-000', conversation: 'CO-000', text: 'hello'};
    const body = JSON.stringify(obj);
    fetch.mockResponseOnce(body, { status: 200, headers: contentTypeJson });
    await expect(conv.createMessage('CO-000', 'hello')).resolves.toEqual(obj);
    expect(fetch).toBeCalledWith('https://localhost/conversations/CO-000/messages', {
      method: 'POST',
      body: JSON.stringify({text: 'hello'}),
      headers: expect.objectContaining({'Content-Type': 'application/json'}),
    });
  });
});
