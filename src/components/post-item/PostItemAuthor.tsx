"use client"
import { type FC, memo } from "react"

import { create } from "@/helpers/bem"
import { isString } from "@/helpers/validations"

import { Avatar } from "../avatar"

import styles from "./PostItemAuthor.module.scss"

import type { PostItemAuthorProps } from "./PostItemAuthor.model"

const bem = create(styles, "PostItemAuthor")

export const PostItemAuthor: FC<PostItemAuthorProps> = memo(
  ({ className, avatar, avatarProps, name, nameProps }) => {
    const authorName = name
    return (
      <div
        itemScope
        className={bem(undefined, undefined, className)}
        itemProp="author"
        itemType="https://schema.org/Person"
      >
        <Avatar
          image={
            /* istanbul ignore next */
            avatar?.src !== undefined && isString(avatar?.src)
              ? { src: avatar?.src, alt: avatar?.alt ?? authorName ?? "" }
              : undefined
          }
          {...avatarProps}
        />
        <p
          aria-label={`Author ${authorName}`}
          {...nameProps}
          className={bem("name", undefined, nameProps?.className)}
          itemProp="name"
        >
          {authorName}
        </p>
      </div>
    )
  },
)

PostItemAuthor.displayName = "PostItemAuthor"
