interface iOption{
  siteURL: string
  audioDir: string
  channels: any
}

interface iChannelOption {
  title: string
  description: string
}

export const getChannelOption = (channel?: string, option?: iOption):iChannelOption | null => {
  const channelOptions = option.channels
  return channel && channel !== 'null' && channelOptions[channel]
    ? channelOptions[channel]
    : channelOptions.default ? channelOptions.default : null
}

export const getSiteUrl = (option?: iOption) => {
  return option.siteURL
}

export const getAudioPath = (option?: iOption) => {
  return option.audioDir
}

export const getChannelTitle = (channel?: string, option?: any) => {
  const channelOption = getChannelOption(channel, option)
  return channelOption ? channelOption.title : 'channel title is not set'
}

export const getChannelDescription = (channel?: string, option?: any) => {
  const channelOption = getChannelOption(channel, option)
  return channelOption ? channelOption.description : 'channel description is not set'
}
