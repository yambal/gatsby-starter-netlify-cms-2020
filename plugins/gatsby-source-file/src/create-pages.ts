import mp3 from './libs/mp3'
import HtmlToSSML from './libs/html-to-ssml'
import { buildMDHash, buildFileNameShort, buildMpCacheValue } from './libs/file-name-builder'
import { getAudioPath } from './libs/option-parser'
import * as fs from 'fs'
import { isRegExp } from 'util'

interface iPodcastBuild {
  edge: any
  option: any
  cashier: any
  reflesh?:boolean
  title?: string
  html?: string
  fileName?: string
  chacheValue?: string
}
const podcastCacheCheck = (edge, pluginOption, cashier) => {
  console.log('\tpodcastCacheCheck')
  return new Promise((resolve: (resolve: iPodcastBuild) => void) => {
    const html = edge.node.html
    const { title, date, channel, slug } = edge.node.frontmatter
    const fileName = buildFileNameShort(channel, slug, 'mp3')
    const chacheValue = buildMpCacheValue(title, html, channel, date, slug)

    console.log(`\t\t${fileName}:${chacheValue}`)

    const mp3PublicPath = `${process.cwd()}/public/${getAudioPath(pluginOption)}`
    const mp3PublicFilePath = `${mp3PublicPath}/${fileName}`

    try {
      fs.statSync(mp3PublicFilePath);
      console.log('ファイル・ディレクトリは存在します。');
      // fs.copyFileSync(mp3PublicFilePath, mp3PublicFilePath);
      // console.log('コピー');
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.log('ファイル・ディレクトリは存在しません。');
      } else {
        console.log(error);
      }
    }

    cashier.get(fileName)
    .then(
      chachedValue => {
        console.log(`\t\tchachedValue:${chachedValue}`)
        if (!chachedValue) {
          resolve({
            edge,
            option: pluginOption,
            cashier,
            reflesh: true,
            title,
            html,
            fileName,
            chacheValue
          })
          return
        }

        if (chachedValue !== chacheValue) {
          resolve({
            edge,
            option: pluginOption,
            cashier,
            reflesh: true,
            title,
            html,
            fileName,
            chacheValue
          })
          return 
        }
        resolve({
          edge,
          option: pluginOption,
          cashier,
          reflesh: false,
          title,
          html,
          fileName,
          chacheValue
        })
      }
    )
  })
}

const podcastBuildMp3 = (i: iPodcastBuild) => {
  console.log('\tpodcastBuildMp3')
  return new Promise((resolve: (resolve: iPodcastBuild) => void) => {
    if (i.reflesh) {
      console.log(`\t\tmake:${i.fileName}`)
      mp3(HtmlToSSML(i.title, i.html), i.fileName, getAudioPath(i.option))
      .then(
        () => {
          resolve(i)
        }
      )
    } else {
      console.log(`\t\tskip:${i.fileName}`)
      resolve(i)
    }
  })
}

const podcastCacheSaver = (i: iPodcastBuild) => {
  console.log('\tpodcastCacheSaver')
  return new Promise((resolve: (resolve: iPodcastBuild) => void) => {
    if (i.reflesh){
      i.cashier.set(i.fileName, i.chacheValue)
      .then(
        () => {
          console.log(`\t\tcached:${i.fileName} - ${i.chacheValue}`)
          resolve(i)
        }
      )
    } else {
      console.log(`\t\tskip:${i.fileName} - ${i.chacheValue}`)
      resolve(i)
    }
  })
}

const podcastEdgeToFile = (edge, options, cashier):Promise<iPodcastBuild> => {
  console.log('podcastEdgeToFile')
  return new Promise((resolve: (resolve: iPodcastBuild) => void) => {
    return podcastCacheCheck(edge, options, cashier)
    .then(
      (res) => {
        return podcastBuildMp3(res)
      }
    )
    .then(
      (res) => {
        return podcastCacheSaver(res)
      }
    )
    .then(
      (res) => {
        resolve(res)
      }
    )
  })
}

module.exports = ({ cache, actions, graphql }, pluginOptions, cb: () => void) => {
  return graphql(`
  {
    allMarkdownRemark(filter: {frontmatter: {templateKey: {eq: "PodCast"}}}, limit: 10) {
      edges {
        node {
          id
          fields {
            slug
          }
          frontmatter {
            slug
            title
            date
            channel
          }
          rawMarkdownBody
          html
        }
      }
    }
  }
  `).then(result => {
    if (result.errors) {
      result.errors.forEach(e => console.error(e.toString()))
      return Promise.reject(result.errors)
    }

    const list = listFiles(`${process.cwd()}/public`);
    console.log(list);

    const edges = result.data.allMarkdownRemark.edges
    Promise.all(edges.map(
      edge => {
        return podcastEdgeToFile(edge, pluginOptions, cache)
      }
    ))
    .then(
      () => {
        console.log('/podcast')
        cb && cb()
      }
    )
  })
}

const FileType = {
  File: 'file',
  Directory: 'directory',
  Unknown: 'unknown'
}

const getFileType = path => {
  try {
    const stat = fs.statSync(path);

    switch (true) {
      case stat.isFile():
        return FileType.File;

      case stat.isDirectory():
        return FileType.Directory;

      default:
        return FileType.Unknown;
    }

  } catch(e) {
    return FileType.Unknown;
  }
}

const listFiles = dirPath => {
  const ret = [];
  const paths = fs.readdirSync(dirPath);

  paths.forEach(a => {
    const path = `${dirPath}/${a}`;

    switch (getFileType(path)) {
      case FileType.File:
        ret.push(path);
        break;

      case FileType.Directory:
        ret.push(...listFiles(path));
        break;

      default:
        /* noop */
    }
  })

  return ret;
};