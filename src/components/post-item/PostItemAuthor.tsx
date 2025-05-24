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
    // TODO: TRANSLATION FIX NEEDED
    // const { t } = useTranslation()
    const authorName = name // ?? t("components.common.postItem.author.name")
    return (
      <div className={bem(undefined, undefined, className)}>
        <Avatar
          image={
            avatar?.src !== undefined && isString(avatar?.src)
              ? {
                  src: avatar?.src,
                  alt: avatar?.alt ?? "",
                }
              : undefined
          }
          {...avatarProps}
        />
        <p
          aria-label={`Author ${authorName}`}
          itemProp="author"
          {...nameProps}
          className={bem("name", undefined, nameProps?.className)}
        >
          {authorName}
        </p>
      </div>
    )
  },
)

PostItemAuthor.displayName = "PostItemAuthor"
