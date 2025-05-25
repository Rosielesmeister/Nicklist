// hooks/useCloudinaryImage.js
import { Cloudinary } from "@cloudinary/url-gen"
import { auto } from "@cloudinary/url-gen/actions/resize"
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity"
import { AdvancedImage } from "@cloudinary/react"

export const useCloudinaryImage = (cloudName) => {
	const cld = new Cloudinary({ cloud: { cloudName } })

	const getOptimizedImage = (publicId, options = {}) => {
		return cld
			.image(publicId)
			.format("auto")
			.quality("auto")
			.resize(
				auto()
					.gravity(autoGravity())
					.width(options.width || 500)
					.height(options.height || 500),
			)
	}

	return { getOptimizedImage }
}
